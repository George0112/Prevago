import requests
import datetime
import time

import MySQLdb
import json
import sys
import os.path
import os

from collections import defaultdict
import collections

import logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s %(name)-36s %(levelname)-8s %(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S',
                    filename = 'storage/logs/agodaLog.log',
                    handlers = [logging.FileHandler('storage/logs/agodaLog.log', 'a', 'utf-8'),])

console = logging.StreamHandler()
console.setLevel(logging.ERROR)

formatter = logging.Formatter('%(name)-12s: %(levelname)-8s %(message)s')

console.setFormatter(formatter)

logging.getLogger('').addHandler(console)

loggerHotel = logging.getLogger('Hotel')
loggerRoom = logging.getLogger('Room')
loggerPrice = logging.getLogger('Price')

# Incase encoding non-ascii
reload(sys)  
sys.setdefaultencoding('utf-8')

db = MySQLdb.connect("localhost", os.environ['MYSQL_USER'], os.environ['MYSQL_PASSWD'], "prevago")
#logFile = open("storage/logs/agodaLog.txt", "a", 0)
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
for day in range(int(sys.argv[1])*6, crawlDays*int(sys.argv[1])+6):
    #logFile.write("INFO: %s Crawler start\n" % (datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
    logging.info("%s Crawler start" % (datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
    checkIn = datetime.date.today() + datetime.timedelta(days=day)
    checkIn = checkIn.strftime("%Y-%m-%d")
    logging.info("Today: " + datetime.date.today().strftime("%Y-%m-%d"))
    logging.info("Check in date : " + checkIn + "  day %d in thread %s" %(day, sys.argv[1]))
    #logFile.write("INFO: Today: " + datetime.date.today().strftime("%Y-%m-%d") + "\n")
    #logFile.write("INFO: Check in date : " + checkIn + "  day %d in thread %s \n" %(day, sys.argv[1]))
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
                logging.error("ResultList post: "+str(e))
                #logFile.write("ERROR: "+str(e) + "\n")
                continue
            try:
                response = r.json()
            except ValueError as e:
                logging.error("ResultList json: "+str(e))
                #logFile.write("ERROR: "+str(e) + "\n")
                continue

            totalPage = response['TotalPage']
            logging.info(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ", Thread " + sys.argv[1] + ", city "+str(cityId) +", page " + str(pageNumber))
            #logFile.write("INFO: " + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") + ", Thread " + sys.argv[1] + ", city "+str(cityId) +", page " + str(pageNumber) + "\n")

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
                    loggerHotel.error("SELECT: "+str(e))
                    #logFile.write("ERROR: "+str(e) + "\n")
                    # Rollback in case there is any error
                    db.rollback()

                if not(hotelName and hotelUrl and latitude and longitude and images):
                    loggerHotel.error("Hotel " + str(hotelName))
                    loggerHotel.error("%s %s %f %f %f %f %s" % (hotelName, hotelUrl, latitude, longitude, reviewScore, starRating, images))
                    #logFile.write("ERROR: "+"Hotel " + str(hotelName) + "\n")
                    #logFile.write("%s %s %f %f %f %f %s\n" % (hotelName, hotelUrl, latitude, longitude, reviewScore, starRating, images))
                    continue

                if(hotelCount <= 0):
                    loggerHotel.info("INSERT: " + str(hotelName))
                    #logFile.write("INFO: Insert hotel: " + str(hotelName) + " \n")
                    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    
                    sql = "INSERT INTO hotels (hotelId, hotelName, hotelUrl, cityName, latitude, longitude, images, created_at) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
                    print sql
                    #sql = "INSERT INTO hotels (hotelId, hotelName) VALUES (1, 'adsfas');"
                    try:
                        # Execute the SQL command
                        cursor.execute(sql, (str(hotelId), hotelName, hotelUrl, cityName, latitude, longitude, str(hotelId)+ ".json", timestamp))
                        # Commit your changes in the database
                        db.commit()
                    except TypeError as e:
                        loggerHotel.error("INSERT: "+str(e))
                        #logFile.write("ERROR: "+str(e) + "\n")
                        print e
                        print "Error inserting hotel"
                        # Rollback in case there is any error
                        db.rollback()

                file1 = open("public/hotelPhoto/" + str(hotelId)+ ".json", "w")
                file1.write(str(images))
                file1.close()
                
                roomList = []
                sql = 'SELECT id, roomName from rooms where hotelId = %s;'
                try:
                    # Execute the SQL command
                    cursor.execute(sql, (str(hotelId)))
                    roomList = cursor.fetchall()
                    # Commit your changes in the database
                    db.commit()
                except TypeError as e:
                    loggerRoom.error('SELECT: '+str(e))
                    #print e
                    #print "Error selecting rooms"
                    #logFile.write("ERROR: "+str(e) + "\n")
                    # Rollback in case there is any error
                    db.rollback()
                

                roomUrl = 'https://www.agoda.com/NewSite/zh-tw/Hotel/PollHotelResult'

                hotelPayload = '{"SearchType":4,"ObjectID":' + str(hotelId) + ',"CheckIn":"' + checkIn + '","Origin":"TW","LengthOfStay":1,"Adults":2,"Children":0,"Rooms":1,"IsEnableAPS":true,"RateplanIDs":[],"PlatformID":0,"CurrencyCode":"NT$","ChildAgesStr":null,"HashId":"","isAgMse":true,"FinalPriceView":1,"IsWysiwyp":true,"PollTimes":1}'
                try:
                    roomRequest = requests.post(roomUrl, data=hotelPayload, headers=headers)
                except ValueError as e:
                    logging.error("PollHotelResult post: "+str(e))
                    #logFile.write("ERROR: "+str(e) + "\n")
                    continue
                if roomRequest.text != '':
                    try:
                        roomData = roomRequest.json()
                    except ValueError as e:
                        logging.error("PollHotelResult json: "+str(e))
                        #logFile.write("ERROR: "+str(e) + "\n")
                        continue
                    if 'rooms' not in roomData:
                        print roomData
                        #raise ValueError("no data in roomData")
                        break
                    priceDict = defaultdict(lambda: defaultdict(lambda: 999999999))
                    roomDict = defaultdict(lambda: defaultdict(lambda: 0))
                    insertRoom = False
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
                        

                        if(not any(roomName == x[1] for x in roomList)):
                            timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                            insertRoom = True
                            loggerRoom.info("INSERT: " + str(roomName))
                            sql = "INSERT INTO rooms (hotelId, roomName, adults, kidForFree, created_at) \
                            VALUES (%s, %s, %s, %s, %s)"
                            
                            try:
                                # Execute the SQL command
                                cursor.execute(sql, (str(hotelId), roomName, adults, children, timestamp))
                                db.commit()
                            except TypeError as e:
                                loggerRoom.error('INSERT: '+str(e))
                                #print e
                                #print "Error inserting rooms"
                                #logFile.write("ERROR: "+str(e) + "\n")
                                # Rollback in case there is any error
                                db.rollback()
                        
                        if priceDict[roomName][supplier] > totalPrice:
                            priceDict[roomName][supplier] = totalPrice
                            roomDict[roomName][supplier] = availability
                    if insertRoom:
                        roomList = []
                        sql = 'SELECT id, roomName from rooms where hotelId = %s;'
                        try:
                            # Execute the SQL command
                            cursor.execute(sql, (str(hotelId)))
                            roomIdNameList = cursor.fetchall()
                            # Commit your changes in the database
                            db.commit()
                        except TypeError as e:
                            loggerRoom.error('SELECT: '+str(e))
                            #print e
                            #print "Error selecting rooms"
                            #logFile.write("ERROR: "+str(e) + "\n")
                            # Rollback in case there is any error
                            db.rollback()
                    insertPriceSql = "INSERT INTO prices (roomId, queryDate, checkInDate, price, roomLeft, supplier, created_at) VALUES "
                    for key, val in priceDict.items():
                        for k, v in val.items():
                            if v != 999999999:
                                queryDate = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d')
                                timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                                totalPrice = v
                                availability = roomDict[roomName][k]
                                supplier = k
                                for i in roomList:
                                    if i[1] == roomName:
                                        roomId = i[0]
                                        break
                                sql = "('%s', '%s', '%s', '%s', '%s', '%s', '%s')"%(str(roomId), queryDate, checkIn, str(totalPrice), int(availability), supplier, timestamp)+','
                                insertPriceSql = insertPriceSql + sql
                    
                    loggerPrice.info('INSERT prices')
                    try:
                        # Execute the SQL command
                        insertPriceSql = insertPriceSql[:-1]
                        print insertPriceSql
                        cursor.execute(insertPriceSql)
                        db.commit()
                    except TypeError as e:
                        loggerPrice.error('INSERT: '+str(e))
                        #print e
                        #print "Error inserting prices"
                        #logFile.write("ERROR: "+str(e) + "\n")
                        # Rollback in case there is any error
                        db.rollback()

                                
            pageNumber += 1
logFile.close()
#print r.text
db.close()
logging.info('FINISH Crawling')

