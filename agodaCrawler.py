import requests


url = 'https://www.agoda.com/api/zh-tw/Main/GetSearchResultList'
headers = {'Content-Type' : 'application/json'}
cityList = ['4951', '8453', '12711', '287008', '12080', '18341', '18346', '18352', '11977', '18347', '756', '11459', '17048', '88773', '23127', '4740', '106001', '286060', '702190']
checkIn = '2018-05-15'
cityId = cityList[4]
pageNumber = 1

payload = '{"IsPollDmc":false,"SearchType":1,"ObjectID":0,"CityId":' + cityId + ',"Latitude":0,"Longitude":0,"Radius":0,"RectangleSearchParams":null,"PageNumber":' + str(pageNumber) + ',"PageSize":2,"SortOrder":1,"CountryName":"Taiwan","CountryId":140,"IsAllowYesterdaySearch":true,"CultureInfo":"zh-TW","UnavailableHotelId":0,"HasFilter":false,"Adults":2,"Children":0,"Rooms":1,"CheckIn":"' + checkIn + '","LengthOfStay":1,"ChildAges":[],"DefaultChildAge":8,"ChildAgesStr":null,"IsDateless":false,"CheckboxType":0}'

r = requests.post(url, data=payload, headers=headers)
response = r.json()

totalPage = response['TotalPage']
print totalPage

for result in response['ResultList']:
    hotelId = result['HotelID']
    #print hotelId
    hotelName = result['HotelDisplayName']
    hotelUrl = result['HotelUrl']

    cityName = result['CityName']

    Images = result['galleryContainerProps']['mainImages']

    reviewScore = result['ReviewScore']

    latitude = result['Latitude']
    longitude = result['Longitude']


    roomUrl = 'https://www.agoda.com/NewSite/zh-tw/Hotel/PollHotelResult'

    hotelPayload = '{"SearchType":4,"ObjectID":' + str(hotelId) + ',"CheckIn":"' + checkIn + '","Origin":"TW","LengthOfStay":1,"Adults":2,"Children":0,"Rooms":1,"IsEnableAPS":true,"RateplanIDs":[],"PlatformID":0,"CurrencyCode":"NT$","ChildAgesStr":null,"HashId":"","isAgMse":true,"FinalPriceView":1,"IsWysiwyp":true,"PollTimes":1}'

    roomRequest = requests.post(roomUrl, data=hotelPayload, headers=headers)
    roomData = roomRequest.json()
    for room in roomData['rooms']:
        roomName = room['name']
        adults = room['adults']
        availability = room['availability']
        price = room['pricing']['displayPrice']
        totalPrice = room['totalPrice']['display']
        #print roomName
#print r.text
