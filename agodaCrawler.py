import requests
import datetime
import time

import MySQLdb
import json
import sys
import os.path
import os

# Incase encoding non-ascii
reload(sys)  
sys.setdefaultencoding('utf-8')

db = MySQLdb.connect("localhost", os.environ['MYSQL_USER'], os.environ['MYSQL_PASSWD'], "prevago")
logFile = open("storage/logs/agodaLog.txt", "a", 0)
cursor = db.cursor()

# Change MySQLdb into utf-8 charset
db.set_character_set('utf8')
cursor.execute('SET NAMES utf8;')
cursor.execute('SET CHARACTER SET utf8;')
cursor.execute('SET character_set_connection=utf8;')


url = 'https://www.agoda.com/api/zh-tw/Main/GetSearchResultList'
headers = {'Content-Type' : 'application/json'}
cityList = []
f = open('cityList.txt', 'r')
line = f.readline()
while line:
    words = line.replace('\n', '').split(',')
    cityList.append(words[1])
    line = f.readline()
print cityList
crawlDays = 6
#checkIn = '2018-05-15'
ts = time.time()
for day in range(int(sys.argv[1])*6, crawlDays*6+6):
    logFile.write("INFO: Crawler start\n")
    checkIn = datetime.date.today() + datetime.timedelta(days=day)
    checkIn = checkIn.strftime("%Y-%m-%d")
    logFile.write("INFO: Today: " + datetime.date.today().strftime("%Y-%m-%d") + "\n")
    logFile.write("INFO: Check in date : " + checkIn + "\n")
    print checkIn
    for cityId in cityList:
        print cityId
        pageNumber = 1
        totalPage = 1
        while pageNumber <= totalPage:
            print 'pageNumber ' + str(pageNumber)
            payload = '{"IsPollDmc":false,"SearchType":1,"ObjectID":0,"CityId":' + cityId + ',"Latitude":0,"Longitude":0,"Radius":0,"RectangleSearchParams":null,"PageNumber":' + str(pageNumber) + ',"PageSize":50,"SortOrder":1,"CountryName":"Taiwan","CountryId":140,"IsAllowYesterdaySearch":true,"CultureInfo":"zh-TW","UnavailableHotelId":0,"HasFilter":false,"Adults":1,"Children":0,"Rooms":1,"CheckIn":"' + checkIn + '","LengthOfStay":1,"ChildAges":[],"DefaultChildAge":8,"ChildAgesStr":null,"IsDateless":false,"CheckboxType":0}'
            
            try: 
                r = requests.post(url, data=payload, headers=headers)
            except ValueError as e:
                logFile.write("ERROR: "+str(e) + "\n")
                continue
            try:
                response = r.json()
            except ValueError as e:
                logFile.write("ERROR: "+str(e) + "\n")
                continue

            totalPage = response['TotalPage']
            logFile.write("INFO: "+str(cityId) +" " + str(pageNumber) + "\n")

            for result in response['ResultList']:
                hotelId = result['HotelID']
                #print hotelId
                hotelName = result['HotelDisplayName']
                hotelUrl = result['HotelUrl']

                print hotelName

                cityName = result['CityName']

                images = result['galleryContainerProps']['mainImages'] #json format
                print cityName
                reviewScore = result['ReviewScore']
                starRating = result['StarRating']

                latitude = result['Latitude']
                longitude = result['Longitude']
                hotelCount = -1
                # insert hotel into database
                sql = 'SELECT * FROM hotels WHERE hotelId = %s'
                try:
                    # Execute the SQL command
                    hotelCount = cursor.execute(sql, (str(hotelId)),)
                    hotelCount = cursor.rowcount
                    print hotelCount
                    # Commit your changes in the database
                    db.commit()
                except ValueError as e:
                    logFile.write("ERROR: "+str(e) + "\n")
                    # Rollback in case there is any error
                    db.rollback()

                if not(hotelName and hotelUrl and latitude and longitude and images):
                    logFile.write("ERROR: "+"Hotel " + str(hotelName) + "\n")
                    logFile.write("%s %s %f %f %f %f %s\n" % (hotelName, hotelUrl, latitude, longitude, reviewScore, starRating, images))
                    continue

                if(hotelCount <= 0):
                    logFile.write("INFO: Insert hotel: " + str(hotelName) + " \n")
                    timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
                    
                    sql = "INSERT INTO hotels (hotelId, hotelName, hotelUrl, cityName, latitude, longitude, images, created_at) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
                    print sql
                    #sql = "INSERT INTO hotels (hotelId, hotelName) VALUES (1, 'adsfas');"
                    try:
                        # Execute the SQL command
                        cursor.execute(sql, (str(hotelId), hotelName, hotelUrl, cityName, latitude, longitude, str(hotelId)+ ".json", timestamp))
                        # Commit your changes in the database
                        db.commit()
                    except TypeError as e:
                        logFile.write("ERROR: "+str(e) + "\n")
                        print e
                        print "Error inserting hotel"
                        # Rollback in case there is any error
                        db.rollback()

                file1 = open("public/hotelPhoto/" + str(hotelId)+ ".json", "w")
                file1.write(str(images))
                file1.close()

                roomUrl = 'https://www.agoda.com/NewSite/zh-tw/Hotel/PollHotelResult'

                hotelPayload = '{"SearchType":4,"ObjectID":' + str(hotelId) + ',"CheckIn":"' + checkIn + '","Origin":"TW","LengthOfStay":1,"Adults":2,"Children":0,"Rooms":1,"IsEnableAPS":true,"RateplanIDs":[],"PlatformID":0,"CurrencyCode":"NT$","ChildAgesStr":null,"HashId":"","isAgMse":true,"FinalPriceView":1,"IsWysiwyp":true,"PollTimes":1}'
                try:
                    roomRequest = requests.post(roomUrl, data=hotelPayload, headers=headers)
                except ValueError as e:
                    logFile.write("ERROR: "+str(e) + "\n")
                    continue
                if roomRequest.text != '':
                    try:
                        roomData = roomRequest.json()
                    except ValueError as e:
                        logFile.write("ERROR: "+str(e) + "\n")
                        continue
                    if 'rooms' not in roomData:
                        print roomData
                        #raise ValueError("no data in roomData")
                        break
                    for room in roomData['rooms']:
                        if 'name' not in room:
                            print room
                            raise ValueError("no data in rooms")
                            break
                        roomName = room['name']
                        adults = room['adults']
                        if 'maxFreeChildren' not in room:
                            children = 0
                        else:
                            children = room['maxFreeChildren']
                        availability = int(room['availability'])
                        price = room['pricing']['displayPrice']
                        totalPrice = room['totalPrice']['display']
                        supplier = room['supplierDisplayName']
                        print roomName + " " + str(availability) + " " + str(totalPrice)
                        
                        # insert rooms into database
                        roomsCount = -1
                        sql = 'SELECT * from rooms where hotelId = %s AND roomName = %s;'
                        try:
                            # Execute the SQL command
                            cursor.execute(sql, (str(hotelId), roomName))
                            roomsCount = cursor.rowcount
                            # Commit your changes in the database
                            db.commit()
                        except TypeError as e:
                            print e
                            print "Error selecting rooms"
                            logFile.write("ERROR: "+str(e) + "\n")
                            # Rollback in case there is any error
                            db.rollback()

                        if(roomsCount <= 0):
                            sql = "INSERT INTO rooms (hotelId, roomName, adults, kidForFree, created_at) \
                            VALUES (%s, %s, %s, %s, %s);"
                            try:
                                # Execute the SQL command
                                cursor.execute(sql, (str(hotelId), roomName, adults, children, timestamp))
                                db.commit()
                            except TypeError as e:
                                print e
                                print "Error inserting rooms"
                                logFile.write("ERROR: "+str(e) + "\n")
                                # Rollback in case there is any error
                                db.rollback()
                        sql = 'SELECT id from rooms where hotelId = %s AND roomName = %s;'
                        try:
                            # Execute the SQL command
                            cursor.execute(sql, (str(hotelId), roomName))
                            roomId = cursor.fetchone()[0]
                            # Commit your changes in the database
                            db.commit()
                        except TypeError as e:
                            print e
                            print "Error selecting rooms"
                            logFile.write("ERROR: "+str(e) + "\n")
                            # Rollback in case there is any error
                            db.rollback()

                        sql = 'SELECT price from prices where roomId = %s AND checkInDate = %s AND queryDate = %s;'
                        DBprice = 999999999
                        try:
                            # Execute the SQL command
                            cursor.execute(sql, (str(roomId), checkIn, datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d')))
                            DBprice = cursor.fetchall()
                            # Commit your changes in the database
                            db.commit()
                        except TypeError as e:
                            print e
                            print "Error selecting prices"
                            logFile.write("ERROR: "+str(e) + "\n")
                            # Rollback in case there is any error
                            db.rollback()

                        if(price < DBprice):
                            timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
                            sql = "INSERT INTO prices (roomId, queryDate, checkInDate, price, roomLeft, supplier, created_at) \
                            VALUES (%s, %s, %s, %s, %s, %s, %s);"
                            try:
                                # Execute the SQL command
                                cursor.execute(sql, (str(roomId), datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d'), checkIn, str(totalPrice), int(availability), supplier, timestamp))
                                db.commit()
                            except TypeError as e:
                                print e
                                print "Error inserting prices"
                                logFile.write("ERROR: "+str(e) + "\n")
                                # Rollback in case there is any error
                                db.rollback()

                                
            pageNumber += 1
logFile.close()
#print r.text
db.close()

