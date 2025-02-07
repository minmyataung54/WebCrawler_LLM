var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var CohereClientV2 = require('cohere-ai').CohereClientV2;
var cohere = new CohereClientV2({
    token: 'C39U8CpKcDnQkA2Dij6m4yr7AKcRlKcKHV8ruvFL',
});
(function () { return __awaiter(_this, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, cohere.chat({
                    model: 'command-r-plus',
                    messages: [
                        {
                            role: 'user',
                            content: "ရှမ်းပြည်နယ်တောင်ပိုင်း မိုးဗြဲမြို့နယ် ရေကာတာမှ ရေဖွင့်ချလိုက်သဖြင့် တိုက်ပွဲဖြစ်နေသော လွိုင်ကော်မြို့အနောက်ဘက်ခြမ်းတွင် ရေကြီးနေကြောင်း မိုးဗြဲနှင့် လွိုင်ကော်ဒေသခံတချို့က Myanmar Now ကို ပြောသည်။ မြို့မြောက်ဘက် ၂ မိုင်ကျော်အကွာတွင် တည်ရှိသည့် မိုးဗြဲရေကာတာ ရေလွှတ်တံခါးအနီးတွင် စစ်ကောင်စီ၏ ခမရ (၄၂၂) တပ်ရင်း အခြေစိုက်ပြီး မိုးဗြဲမြို့ကိုမူ ကရင်နီတော်လှန်ရေးအင်အားစုက ၂၀၂၃ နိုဝင်ဘာကတည်းက ထိန်းချုပ်ထားသည်။ ရေကာတာ၏ ရေလွှတ်တံခါးကို ဇူလိုင်လ ၂၄ ရက်ဝန်းကျင်တွင် စစ်ကောင်စီတပ်က ဖွင့်ချလိုက်သဖြင့် ဘီလူးချောင်းရေကြီးရကြောင်း မိုးဗြဲမြို့နယ်တွင် ကယ်ဆယ်ရေးလုပ်နေသည့် အမျိုးသားတစ်ဦးက Myanmar Now ကို ပြောသည်။ ဘီလူးချောင်းသည် မိုးဗြဲနှင့် လွိုင်ကော်မြို့တို့ကို ဖြတ်သန်းစီးဆင်းပြီး လောပိတရေအားလျှပ်စစ်စီမံကိန်းအတွက် အရေးပါသည့် ချောင်းဖြစ်သည်။ ဘီလူးချောင်းရေလျှံသဖြင့် မိုးဗြဲမြို့နယ်နှင့် လွိုင်ကော်မြို့အနောက်ဘက်ခြမ်း လယ်မြေများ ရေကြီးနေကြောင်း အထက်ပါ သတင်းရင်းမြစ်က ရှင်းပြသည်။ “သူတို့ (စစ်ကောင်စီတပ်) ဖွင့်ချလိုက်လို့ပေါ့။ အခု ပြီးခဲ့တဲ့ ၃ ရက်၊ ၄ ရက်မှ တောက်လျှောက် ဖွင့်ချလိုက်တာ။ နွေရာသီမှာလည်း ရေတွေကို လှောင်ထားပြီး မဖောက်ချဘဲနဲ့ ဒီနှစ်တော့ နည်းနည်းပိုစောပြီး ဖောက်ချတယ်။ ပြီးခဲ့တဲ့နှစ် ပမာဏထက်ကို ၂ ပေကျော်ကျော်၊ ၃ ပေလောက် ရောက်သွားပြီ” ဟု သူက ဆိုသည်။ လွိုင်ကော်မြို့တွင် နေထိုင်ခဲ့ဖူးပြီး လက်ရှိတွင် ကရင်နီတော်လှန်ရေးတပ်ထိန်းချုပ်ရာ နယ်မြေ၌ စစ်ရှောင်နေသည့် အမျိုးသားတစ်ဦးကလည်း မိုးရွာသွန်းမှုများလာသဖြင့် စစ်ကောင်စီဘက်က ရေကာတာကို ရေဖောက်ထုတ်ခြင်းဖြစ်နိုင်ကြောင်း ယူဆသည်။ “အရင်ကဆိုရင် လွိုင်ကော်မှာ ချောင်းနဲ့နီးစပ်တဲ့ အိမ်တွေပေါ့။ အဲဒါတွေမြုပ်တယ်ဗျ။ အခု ရေက နားလည်တတ်ကျွမ်းမှုမရှိဘဲနဲ့ လျှောက်လွှတ်ချတယ် ထင်ပါတယ်။ ၈ ပေဆိုတာကတော့ တော်တော်များတယ်။ အခု ဒီလောက်အထိကြီးကျတော့ မဖြစ်တာ ကြာပြီ” ဟု ၎င်းက ဆိုသည်။ မိုးဗြဲဆည်ရေတံခါးနှင့် ခမရ (၄၂၂) တပ်တည်နေရာ။ ဆက်လက်၍ ကရင်နီတော်လှန်ရေးတပ်ထိန်းချုပ်ရာ နယ်မြေ၌ စစ်ရှောင်နေသည့် လွိုင်ကော်မြို့ခံ အမျိုးသားက မိုးရွာသွန်းမှု မရပ်ဘဲ ဆက်များနေမည်ဆိုပါက ရေပိုကြီးနိုင်ပြီး စပါးစိုက်ဧကများလည်း ပျက်စီးနိုင်ကြောင်း ပြောသည်။ ဒေသတွင်း ရေကြီးမှုအခြေအနေကို ပိုမိုသိရှိနိုင်ရန် Myanmar Now က စစ်ကောင်စီ၏ ရှမ်းပြည်နယ်အစိုးရအဖွဲ့ ပြောရေးဆိုခွင့်ရှိသူ ခွန်သိမ်းမောင်၊ ကယားပြည်နယ်အစိုးရအဖွဲ့ ပြောရေးဆိုခွင့်ရှိသူ လက်ထောက်ညွှန်ကြားရေးမှူး ဦးဇာနည်မောင်တို့ကို ဖုန်းဖြင့် ဆက်သွယ်သော်လည်း ဖုန်းပိတ်ထားသဖြင့် အဆက်အသွယ်မရပေ။ လွိုင်ကော်မြို့ပေါ်တွင်မူ စစ်ကောင်စီဘက်က စိုးမိုးနယ်မြေတိုးချဲ့သည့် စစ်ရေးလှုပ်ရှားမှု လုပ်နေသဖြင့် လွိုင်ကော်မြို့တောင်ဘက် မိုင်းလုံးရပ်ကွက်တွင် တိုက်ပွဲဖြစ်နေကြောင်း ကရင်နီအမျိုးသားများကာကွယ်ရေးတပ် KNDF ထံမှ သိရသည်။ စစ်ကောင်စီတပ်၏ လက်နက်ကြီးပစ်ခတ်မှုများ ဆက်ရှိနေသည်ဟုလည်း KNDF ဗဟိုပြန်ကြားရေးတာဝန်ခံ တာအယ်စိုးက ပြောသည်။ ရေကြီးရေလျှံမှုကြောင့် စစ်ရှောင်များသည် ရေလွတ်မည့် အမြင့်ပိုင်းနေရာများသို့ ပြောင်းရွှေ့နေရကြောင်း မိုးဗြဲနှင့် လွိုင်ကော်ဒေသခံတချို့က ဆိုသည်။ ၂၀၂၃ ခုနှစ် အောက်တိုဘာလကလည်း စစ်ကောင်စီတပ်သည် မိုးဗြဲရေကာတာ ရေတံခါးကို ဖွင့်လိုက်ပြီး မိုးရွာသွန်းမှုလည်း များသဖြင့် ဘီလူးချောင်းရေလျှံခဲ့သေးသည်။ ထိုစဉ်က ရေကြီးမှုကြောင့် မိုးဗြဲနှင့် လွိုင်ကော်မြို့အနောက်ဘက်ခြမ်းက စပါးစိုက်ဧက ၁ သောင်းကျော် ပျက်စီးခဲ့ရကြောင်း ကြားကာလ ကရင်နီပြည်နယ်အုပ်ချုပ်ရေးကောင်စီ (IEC) ၏ အချက်အလက်အရ သိရသည်။  From this passage, What’s the reason behind this flooding and last year October, tell me the details of the amount of loss and damaged area? "
                        },
                    ],
                })];
            case 1:
                response = _a.sent();
                console.dir(response, { depth: null });
                return [2 /*return*/];
        }
    });
}); })();
