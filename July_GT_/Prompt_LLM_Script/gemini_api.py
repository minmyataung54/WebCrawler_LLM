import requests
import json

url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

payload = json.dumps({
  "contents": [
    {
      "parts": [
        {
          "text": """
You are an information extraction system. Read the following article carefully and extract structured information about crisis events.
Special Rule
Each <event> ... </event> block in the article represents one distinct event.


For every <event> block, output one JSON object.


Collect all extracted event objects into a JSON array [ {...}, {...}, ... ].



Crisis Type Definitions
Use the following rules to decide the 'Crisis type':
Armed Conflict → Fighting between two or more armed organizations (military, militias, armed groups) in combat over territory, resistance, or control.


Attack → Unilateral violence by armed actors targeting civilians directly.


Airstrike → Explosive or projectile attacks carried out from the air by planes, helicopters, or drones.


Bombing → Ground-based planted or manually delivered explosives.


Fire → When armed organizations deliberately use arson to burn homes, buildings, villages, or vehicles.


Natural Disaster → Crises caused by natural forces such as floods, earthquakes, or landslides, not by human actors.



Explanation of Each Field
“Crisis type” → Must strictly follow one of the six categories above.


“Location” → The event location, always written as: township/city/state, country. Do not use village names, street names, or smaller units. Always start from township level or higher.


“Date” → The date in DD/MM/YYYY format (example: '13/03/2023'). If not mentioned, 'NA'.


“Affected_Civilian” → 'TRUE' if civilians are mentioned as affected, 'FALSE' if explicitly stated as not affected, 'NA' if not mentioned.


“Affected_Women” → 'TRUE' if women are mentioned as affected, 'FALSE' if explicitly stated as not affected, 'NA' if not mentioned.


“Affected_Children” → 'TRUE' if children are mentioned as affected, 'FALSE' if explicitly stated as not affected, 'NA' if not mentioned.


“Civilian_Properties_Damage” → 'TRUE' only if civilian-owned properties are damaged. If only military or armed group facilities are damaged, return 'FALSE'. If not mentioned, 'NA'.


“Civilian_Forced_Displacement” → 'TRUE', 'FALSE', or 'NA'.


“Civililan_Fatalities” → Civilian deaths. Use integer only, or 'NA'.


“Armed_Personnel_Fatalities” → Armed group member deaths. Use integer only, or 'NA'.


“Number_of_People_Displaced” → Numbers of people displaced. Use integer only, or 'NA'.


“Involved_Parties” → List of groups or actors explicitly mentioned (e.g., ['Military', 'People's Defense Force (PDF)']). If none are mentioned, return an empty list [].




Article:

မြောက်ဦး-၂၀၂၄ ဩဂုတ် ၁၀(မော်ကွန်း)
<event>အာရက္ခတပ်တော် (AA) က သိမ်းပိုက်ထိန်းချုပ်ထားတဲ့ ရခိုင်ပြည်နယ်က ရှေးဟောင်းမြို့တော်မြောက်ဦးမြို့ကို စစ်ကောင်စီက ဒီနေ့လယ် ၁၂ နာရီမှာ ဂျက်လေယာဉ်နဲ့ လာရောက်ဗုံးကြဲခဲ့တာကြောင့် ကလေးငယ်တစ်ဦးအပါအဝင် ဒေသခံခြောက်ဦးသေဆုံးခဲ့ပြီး ခုနစ်ဦး ဒဏ်ရာရရှိတယ်လို့ ဒေသခံတချို့က ပြောပါတယ်။
မြောက်ဦးမြို့ပေါ်က သမိုင်းဝင်ဘုရားဖြစ်တဲ့ သျှစ်သောင်းဘုရားနဲ့ ကြက်ဈေးရပ်ကွက်ကြားမှာရှိတဲ့ နဝရတ်ဟိုတယ်အနီးကို လာရောက်ဗုံးကြဲခဲ့တာလို့ ဒေသခံတွေက ဆိုပါတယ်။
“ဟိုတယ်အရှေ့ကလမ်းပေါ်ကျပြီး လမ်းမှာသွားနေတဲ့ အိန္ဒိယဘီး( ဒေသအခေါ်အဝေါ် တုတ်တုတ်ချေ)နဲ့ အနီးအနားရွာတွေကိုပြေးဆွဲနေတဲ့ခရီးသည်ကားတွေကို လာထိတာပါ။ သေဆုံးသူတွေနဲ့ ဒဏ်ရာရရှိသူတွေက ဘယ်သူဘယ်ဝါဆိုတာ အတည်မပြုနိုင်သေးပါဘူး။မြို့ခံတွေလား၊ နယ်ဘက်တွေက ဈေးလာဝယ်သူတွေလားဆိုတာ စုံစမ်းနေကြတယ်” လို့ အခင်းဖြစ်ရာနေရာအနီးမှာရှိတဲ့ မြောက်ဦးမြို့က တုတ်တုတ်မောင်းသူတစ်ဦးက ပြောပါတယ်။
ဒဏ်ရာရရှိသူတွေကို မြောက်ဦးဆေးရုံကြီးဆီ အရေးပေါ်ပို့ဆောင်ထားတယ်လို့လည်း သူက ဆက်ပြောပါတယ်။
အရပ်သားတွေစုဝေးရာနေရာတွေကို ပစ်မှတ်ထားကာ လေကြောင်းတိုက်ခိုက်မှုတွေ တဖန် ပြန်လုပ်လာတဲ့အတွက် မြောက်ဦးမြို့ခံတွေဟာ စိုးရိမ်ပူပန်နေကြတယ်လို့ တချို့ကလည်း ပြောပါတယ်။
” ဆေးရုံပို့သူပို့၊ ရင်ခွဲရုံပို့သူပို့နဲ့ အကုန်လုံးရုန်းရင်းဆန်ခတ်ဖြစ်နေကြပါတယ်။ မထင်မှတ်ဘဲ လာပစ်တာဆိုတော့ အကုန်လုံးကြောက်ကြောက်လန့်လန့် ဖြစ်ကုန်ကြတယ်။အရင်ကဆို လေယာဉ်သံကြားတာနဲ့ ပြေးပုန်းကြတယ်။ အခုက မပစ်တာလည်းကြာတော့ ပစ်မယ်လို့ မထင်ထားဘဲ ပုံမှန် သွားလာကြတာ။ ပြီးတော့ ဒီနေ့က စနေနေ့(ဈေးနေ့) ဆိုတော့ ဈေးသွားဈေးလာတွေနဲ့လူတွေစည်နေတုန်း လာပစ်သွားတာ” လို့ မြောက်ဦးမြို့က နောက်ထပ် ဒေသခံတစ်ဦးကပြောပါတယ်။</event>
ပြီးခဲ့တဲ့ သြဂုတ် ၆ ရက်ကလည်း မြောက်ဦးမြို့နယ်၊အုတ်ဖိုကန်ကျေးရွာထဲကို စစ်ကောင်စီက လာရောက်ဗုံးကြဲခဲ့တာကြောင့် အမျိုးသမီးငယ်တစ်ဦး ဒဏ်ရာအပြင်းအထန် ရရှိသွားခဲ့ပါတယ်။

"""
    }
      ]
    }
  ]
})
headers = {
  'X-goog-api-key': 'AIzaSyBBkGmUt4loKOZcXX_E6iyGR2PwDRwtfI8',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

# Parse the JSON response
response_json = response.json()

# Extract only the content text from Gemini response
content = response_json["candidates"][0]["content"]["parts"][0]["text"]

print(content)
