import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function GET() {
  return Response.json("");
}

function generateRandomString(): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < 14; i++) {
    const randomIndex = Math.floor(Math.random() * (characters.length - 1));
    result += characters.charAt(randomIndex);
  }

  return result;
}

interface UserData {
  lastMessage: string;
  sendLastMessage: boolean;
  figuredOutCommands: boolean;
  askAboutRope: boolean;
  firstTurn: number;
  torches: number;
  location: { x: number; y: number };
  danielTile: number;
  minisTile: number;
  sendMap: boolean;
  minis_response: number;
  resetFlag: boolean;
  searchChest: boolean;
  minisBlock: boolean;
  searchChestHidden: boolean;
  tomTile: number;
  holtTile: number;
  device: boolean;
  leeTile: number;
  leePassed: boolean;
  orNotes: Array<boolean>;
  orFoundNote: boolean;
  orTile: number;
  beatOr: boolean;
  beatLee: boolean;
  passedGameTile: number;
  sugar: boolean;
  canTeleport: boolean;
  easterEgg: boolean;
}
let users: Map<string, UserData> = new Map();

let emptyDialogue = [
  "[X] נראה שהאיזור הזה ריק.",
  "[X] הכל מסביבכם ריק, נראה שאין פה שום דבר.",
  "[X] נראה שאין פה שום דבר.",
];
let danielDialogue = [
  "אתם ממשיכים לחפש סימן חיים כלשהו ביער, ופתאום מוצאים דמות בלונדינית, קשורה עם חבל לעץ עבה במיוחד. אתם מזהים את הדמות בתור הראש הצף מאוקיינוס הדם שנתנה לכם עצות ועזרה במהלך החידה.",
  "דניאל: שלום שוב.",
  "דניאל: הצלחתם למצוא אותי.",
  "דניאל: כפי שאתם רואים, אור ולי לא אהבו שנתתי לכם לעבור את חידה 5 בכזו קלות.",
  "דניאל: הם לא אמרו לי שום דבר לגבי החידה...",
  "דניאל: אני יודע שזה לא הרבה..",
  "דניאל: סליחה....",
  "*השתמשו ב-/askaboutXXXX בכדי לשאול את דניאל שאלה*",
  "דניאל: בהצלחה לכם...",
];
let danielRopeDialogue = [
  "דניאל: אה... כן..",
  "דניאל: הם קשרו אותי לעץ",
  "דניאל: יכולים לעזור לי לצאת מפה?",
  "*אתם פותחים את הקשר...*",
  "*הקשר נפתח*",
  "דניאל: וואו, תודה! אני מניח שאתם לא אנוכיים כמו אור ולי...",
  "דניאל: כלומר, זה מלכתחילה ממש לא בסדר להשוות אתכם לאור ולי, סליחה.. לא יודע למה אמרתי את זה",
  "דניאל: היי! תראו את זה!",
  "*איפה שישב מקודם דניאל קשור לרצפה, אתם רואים מפה. הקלידו /map בכדי לקרוא את המפה*",
  "דניאל: אני לא יודע עד כמה זה יעזור, נראה שהכל התלכלך...",
  "דניאל: תודה שוב!",
  "דניאל: בהצלחה!",
];
let minisDialogue = [
  "מיניס: הייי...... אמ...... ....",
  "מיניס: כן זה קצת מביך....",
  "*ענו עם /yes_it's_awkward או /what_are_you_talking_about*",
  "...",
  "*מיניס מחכה בקוצר רוח שתגידו משהו שיוריד ממנו את הרגשות אשם*",
  "*ענו עם /yes_it's_awkward או /what_are_you_talking_about*",
  "*אתם בוחרים לא להגיד כלום*",
  "*מיניס לא אומר כלום, אבל אתם רואים שהרגשות אשם גורמים לו להרגיש נורא עם עצמו, הוא מזיע ומגמגם*",
  "מיניס: בכל מקרה, אור ולי דפקו גם אותי",
  "מיניס: הם אמרו לי יש פה הזדמנות לעשות קצת פיתוח.. קצת האקינג...",
  "מיניס: בסוף לא רק שהם בגדו בי ומחקו לי את הגישת אדמין לשרת",
  "מיניס: הם גם החליטו שלא עשיתי עבודה מספיק טובה וכתבו את שאר האתר -בhtml!!!",
  "מיניס: אני אשמח לעזור לכם לפתור את החידה ולהביס אותם.",
  "מיניס: הכנסתי תיבה לפה. אין לי מושג איפה הם החביאו אותה בסוף, אבל בשביל לפתוח אותה תצטרכו פשוט לכתוב /search_chest בחדר של התיבה.",
  "מיניס: זה הכל.",
];

let holtDialogue = [
  "הגעתם לרחוב הולצמן.",
  "מימינכם יש אוֹרָה אדירה, נראה שכוח אפל מאוד שוכן שם.",
];

let tomDialogue = [
  "תום: שלום וברכות, חבריי ההרפתקאנים!",
  "תום: ובכן, נראה שנתקלתי בתעלול ערמומי ביותר של חבריי הטובים אור ולי!",
  "תום: אנוכי תוהה אם כְּששלחו אותי לפה לקנות סוכר, הלא הערימו עליי בתַּעֲלוּלֵי מוּקְיוֹנִים!",
  "*אתם תוהים אם תום תמיד מדבר ככה*",
  "תום: אנוכי חושד אם כי לא אחרי מעשה וטעייה רבים שמימיני נמצא פורטל אינטר-דיימנסיונלי בו אנוכי תקוע כבר רבות שנים.",
  "תום: יהיה לי לכבוד גדול להעניק לכם מכשיר המאפשר לזהות את מיקומכם, הרי שההִתְעַתְּקוּת מקשה על זאת.",
  "*קיבלתם את המכשיר*",
  "תום: איך לבצע את הההִתְעַתְּקוּת בפורטל?",
  "תום: יאומת כי אנוכי עדיין זקוק לפורטל בכדי למצוא את הסוכר. הפורטל עובד רק עבור אדם אחד.",
  "תום: סליחות רבות.",
  "תום: אם אמצא את הסוכר, אין עוררין כי אעזור לכם.",
  "תום: וזאת הכל.",
  "תום: בְּאֵין צִפּוֹר שִׁיר גַּם עוֹרֵב יְחַשֵּׁב כִּזְמִיר.",
];

let leeDialogue = [
  "לי: ובכן...",
  "לי: ...",
  "לי: נראה שהפרחח העיקרי הגיע..",
  "לי: שלום וברוכים הבאים לסוף של החידה.",
  "לי: מזל טוב.",
  "לי: כן כן, מגיע לכם. הרי פתרתם את כל החידה בצורה פיירית לגמרי, השקעתם והצלחתם.",
  "לי: ..לא!",
  "לי: אני שונא רמאים!",
  "לי: מה אתם עושים אותה כאילו אתם לא יודעים?!",
  "לי: חשבתם שלא אשים לב? דילגתם על החידה הראשונה!!",
  "לי: והכל בגלל הדניאל הזה.",
  "לי: לא, זו אשמתכם. יכולתם לפתור את זה רגיל ולהתעלם ממנו.",
  "לי: אולי קיים יקום אחר בו הייתי נותן לכם לעבור הלאה, סתם כי אני נחמד. בתור מחווה על כך שעברתם את הכל.",
  "לי: השקעתי כל כך הרבה בחידה, ופתרתי כל כך הרבה חידות בעצמי, אני מבין כמה זה קשה, וכמה מאמץ זה לוקח.",
  "לי: אבל עכשיו זה בחיים לא יקרה. אתם תקועים פה לתמיד, ולא תוכלו לסיים את החידה אף פעם.",
  "לי: אולי לאור אין בעיה עם זה, אבל איתי זה לא עובד ככה.",
  "לי: תיהנו להיתקע פה בלי הסיפוק של לסיים את החידה.",
  "לי: מגיע לכם.",
];

let leePassedDialogue = [
  "לי: ובכן...",
  "לי: ..?",
  "לי: מה?",
  "לי: איך זה יכול להיות?!",
  "לי: אתם פתרתם את כל החידות.. בצורה פירית לגמרי???",
  "לי: ולא רימיתם????",
  "לי: אני... החידות שלי.. נפתרו!?",
  "לי: זה.. אומר שאני לא טוב מספיק? שהחידות לא היו מספיק טובות..?",
  "לי: אני.. אני צריך רגע לחשוב על זה..",
  "*לי נראה מדוכא, הוא ממלמל לעצמו. נראה שהבסתם אותו*",
];

let orDialogue = [
  "אור: こんにちは!",
  "אור: オル・パズです。",
  "אור: トムに砂糖を買いに行かせたんだけど、次元の狭間から抜け出せないとかよくわからないアニメみたいな状況みたい。",
  "אור: 今どこにいるかわかる？",
  "אור: そうだったね。お前がここにいるのは俺に勝つためとかそんなんだっけ。",
  "אור: 悪い。ベートーベンの月光を弾いてるから今は無理。",
  "אור: 聞かせてあげようか？めっちゃうまいよ。",
  "*/step6_dungeonsanddragons/moonlight.mp4*",
  "*נראה שאור עשה כמה טעויות בנגינה שלו*",
  "*הוא בטוח ב-100% שהוא ניגן את היצירה מושלם, הוא מסרב להאמין אחרת. אולי תוכיחו לו שהוא טועה..?*",
];

let OrPassedDialogue = [
  "אור: えっ？！俺間違ってるの？？",
  "אור: いいえ！ありえない！！",
  "אור: やられたぜ。。",
  "*אור נראה びっくりする מדי בכדי להמשיך את השיחה. הערת מתרגם: המשמעות של びっくりする ביפנית היא 'מופתע' או מפוחד.",
];

let PassedGameDialogue = [
  "הבסתם את אור ולי!",
  "לי: לא! אני לא מאמין שעשיתם את זה..!",
  "אור: 本当にありえない！！",
  "לי: ובכן.. חשבתם שזה הסוף! אבל זה לא!",
  "לי: כן, כן. יש חידה שביעית",
  "לי: ושמינית, ותשיעית, ועשירית..",
  "לי: אתן לכם ספוילר, לחידה ה-11 עליכם לטוס למצרים, למצוא דרך לעבור ליקום מקביל בו אנימה קיים, למצוא את דיו ולהביס אותו.",
  "אור: まあ、プラっス・ノーベルもらうでしょう？そうならいいじゃん！！",
  "לי: תגיד, מה הקטע שאתה מדבר יפנית כל הזמן? אתה לא דובר עברית כאילו?",
  "אור: 黙っれ！ヘブライ語喋れるけど、日本語で話したら、人間はGoogle Translateを使わなきゃ！",
  "לי: כן... מסכים עם כל מה שאמרת.",
  "לי: בכל אופן! אנחנו יוצרי החידה! אנחנו יכולים לעשות מה שבא לנו!! הפסדתם!! אתם תקועים פה לנצח!",
  "לי: ...",
  "אור: ...",
  "לי: וואו, נהיה ממש משעמם פתאום.",
  "אור: それな。",
  "לי: ...",
  "לי: רגע, אם ישעמם לכם, זה לא אומר שתעזבו?",
  "לי: ואז לא יהיה לנו מישהו שישחק בחידות שלנו..?",
  "לי: רגע. החידות האלו רק כיפיות כי מישהו מנסה לפתור אותן בסוף.",
  "לי: אם אנחנו מכריחים אתכם להישאר פה, ואתם לא נהנים, אין בזה פואנטה.",
  "אור: そうだね。。。",
  "לי: אם כך, אני אתן לכם לסיים את החידה. נעצור פה.",
  "לי: ואני חושב שעכשיו אני אעריך את השחקנים שלי הרבה יותר! תודה רבה! באמת למדתי לקח חשוב לחיים.",
  "אור: וואו זה מה זה cheesy מי כתב את זה",
  "לי: מה? זה היה ממש משפט חמוד לסיים איתו את החידה!",
  "לי: רגע מה זאת אומרת 'כתב את זה'? זה אני",
  "אור: לא לא, אתה לא מבין. מי שכתב את מה שאתה אמור להגיד.",
  "לי: מה זאת אומרת מי שכתב את מה שאני אמור להגיד? אני אומר את מה שאני רוצה להגיד!",
  "אור: לא אחי, תראה. אני יכול לגרום לך להגיד מה שאתה רוצה",
  "לי: אני שונא אסקייפ רומס, אני אוכל סטייק לארוחת בוקר ויש לי לפחות שלושה ילדים כלואים במרתף.",
  "לי: היי מה זה? מי כותב את זה? זה אתה?",
  "אור: לא, זה אני. דניאל. כל מה שאמרת בחידה עד כה נכתב על ידיי. כל מחשבה וזיכרון שאי פעם היו לך הם בגללי.",
  "לי: מה? אז אין לנו free will?",
  "אור: לא, ואחרי בדיוק 4 שניות הם יעברו לעמוד הסיום וה-consciousness שלך כמו גם כל הזכרונות שלך ימחקו לתמיד.",
  "לי: מה? לאאאאאא",
];

function resetUser(userId: string, resetFlag: boolean) {
  users.set(userId, {
    lastMessage: "",
    sendLastMessage: false,
    figuredOutCommands: false,
    askAboutRope: false,
    torches: 15,
    firstTurn: -1,
    location: { x: 0, y: 0 },
    danielTile: -1,
    minisTile: -1,
    sendMap: false,
    minis_response: 0,
    resetFlag: resetFlag,
    searchChest: false,
    searchChestHidden: false,
    minisBlock: false,
    tomTile: -1,
    holtTile: -1,
    device: false,
    leeTile: -1,
    leePassed: false,
    orNotes: [false, false, false],
    orFoundNote: false,
    orTile: -1,
    beatOr: false,
    beatLee: false,
    passedGameTile: -1,
    sugar: false,
    canTeleport: false,
    easterEgg: false,
  });
}
function handleCommand(userId: string, command: string, leePassed: boolean) {
  let user = users.get(userId);
  if (user == null) {
    return;
  }
  user.firstTurn++;

  user.leePassed = leePassed;
  if (
    command.startsWith("/search_chest") &&
    command != "/search_chest_result:true"
  ) {
    user.torches--;
    user.figuredOutCommands = true;
    user.searchChest = true;
    return;
  }
  switch (command) {
    case "/cheats_unlock_hi":
      user.torches = 1000;
      break;
    case "/confrontorandlee":
      user.easterEgg = true;
      handleMovement(userId, 0, 0);
      break;
    case "/lastmessage":
      user.sendLastMessage = true;
      break;
    case "/reset":
      resetUser(userId, true);
      break;
    case "/sugarleftatholt":
      if (user.tomTile > 5) {
        user.sugar = true;
      } else {
        user.sugar = false;
      }
      user.figuredOutCommands = true;
      handleMovement(userId, 0, 0);
      break;
    case "/left":
      user.torches--;
      user.figuredOutCommands = true;
      handleMovement(userId, -1, 0);
      break;
    case "/right":
      user.torches--;
      user.figuredOutCommands = true;
      handleMovement(userId, 1, 0);
      break;
    case "/up":
      user.torches--;
      user.figuredOutCommands = true;
      handleMovement(userId, 0, -1);
      break;
    case "/down":
      user.torches--;
      user.figuredOutCommands = true;
      handleMovement(userId, 0, 1);
      break;
    case "/askaboutrope":
      if (user.danielTile > -1) {
        user.danielTile = -1;
        user.askAboutRope = true;
        user.figuredOutCommands = true;
        user.torches--;
      }
      handleMovement(userId, 0, 0);
      break;
    case "/yes_it's_awkward":
      if (user.minisTile >= 2 && user.minisTile <= 5) {
        user.minis_response = 1;
        user.figuredOutCommands = true;
        user.torches--;
      } else {
        handleMovement(userId, 0, 0);
      }
      break;
    case "/what_are_you_talking_about":
      if (user.minisTile >= 2 && user.minisTile <= 5) {
        user.minis_response = 2;
        user.figuredOutCommands = true;
        user.torches--;
      } else {
        handleMovement(userId, 0, 0);
      }
      break;
    case "/map":
      user.sendMap = true;
      user.torches--;
      user.figuredOutCommands = true;
      break;
    case "/search_chest_result:true":
      user.torches--;
      user.figuredOutCommands = true;
      user.searchChestHidden = true;
      break;
    default:
      handleMovement(userId, 0, 0);
      break;
  }
}

function sendResponseString(userId: string): string {
  let user = users.get(userId);
  let str: string = "";
  if (user == null) {
    return "אירעה שגיאה. זה לא קשור לחידה, נסו לרענן מחדש.";
  }
  if (user.sendLastMessage) {
    user.sendLastMessage = false;
    return user.lastMessage;
  }
  if (user.torches <= -1) {
    user.lastMessage = "נגמרו לכם הלפידים. נראה שצריך לאפס את העולם.";
    return "נגמרו לכם הלפידים. נראה שצריך לאפס את העולם.";
  }
  if (user.resetFlag) {
    user.resetFlag = false;
    users.delete(userId);
    return "העולם אופס.";
  }
  //////////////
  if (user.firstTurn < 1 && user.torches == 15) {
    str =
      "אתם נמצאים בחלל כהה ואפל, ריק מכל אור. נראה שאין כלום מימינה, משמאלה ומלמטה. למזלכם, הגעתם עם לפידים.";
  } else if (user.canTeleport) {
    if (user.location.x == 7 && user.location.y == 7) {
      user.location.x = -6;
      user.location.y = -12;
      str = "כוח אפל ששכן במקום בו הייתם שיגר אתכם למיקום אחר.";
    } else if (user.location.x == -6 && user.location.y == -12) {
      user.location.x = -6;
      user.location.y = 5;
      str = "כוח אפל ששכן במקום בו הייתם שיגר אתכם למיקום אחר.";
    } else if (user.location.x == -6 && user.location.y == 5) {
      user.location.x = 19;
      user.location.y = 4;
      str = "כוח אפל ששכן במקום בו הייתם שיגר אתכם למיקום אחר.";
    } else if (user.location.x == 19 && user.location.y == 4) {
      user.location.x = 9;
      user.location.y = 1;
      str = "כוח אפל ששכן במקום בו הייתם שיגר אתכם למיקום אחר.";
    } else if (user.location.x == 9 && user.location.y == 1) {
      user.location.x = 7;
      user.location.y = 7;
      str =
        "כוח אפל ששכן במקום בו הייתם שיגר אתכם למיקום אחר. נראה שחזרתם להתחלה, אבל משהו שונה.. לאוויר יש ריח נוסטלגי, נראה שאתם בעבר. /step6_dungeonsanddragons/past";
    }
  } else if (user.easterEgg) {
    str =
      "אור ולי: הממ?? מה אתם רוצים מאיתנו? .. ואיך אתם יודעים על הפקודה הזו?!";
    user.easterEgg = false;
  } else if (
    user.location.x == 0 &&
    user.location.y == 0 &&
    !user.figuredOutCommands
  ) {
    str = "אתם עדיין באותו חלל ריק.";
  } else if (user.sendMap == true) {
    str = "/step6_dungeonsanddragons/map.png";
    user.sendMap = false;
  } else if (user.orFoundNote == true) {
    user.orFoundNote = false;
    str =
      "*נראה שמישהו ניגן בפסנתר והתווים שהוא ניגן היו כל כך גרועים שהם יצרו קרע בין-מימדי פה.*";
  } else if (user.searchChestHidden) {
    if (user.location.x == 2 && user.location.y == -3) {
      str = "מצאתם את התיבה! היא מכילה: +25 לפידים.";
      user.torches += 25;
    } else {
      str = "אין תיבה באיזור.";
    }
    user.searchChestHidden = false;
  } else if (user.searchChest) {
    if (user.location.x == 2 && user.location.y == -3) {
      str =
        "מצאתם את התיבה! היא מכילה: ACCESS DENIED, ADMINISTRATOR PRIVILEGES MISSING.";
    } else if (user.minisTile >= 0 && user.minisTile < 13) {
      str =
        "המממ??? איך אתם מכירים את הפקודה הזו?? לא! אתם בטח סוכנים חשאיים של אור ולי. אני מסרב לשוחח איתכם.";
      user.minisBlock = true;
    } else if (user.minisTile >= 0) {
      str =
        "מה? ניסיתם את הפקודה והיא לא עובדת? אה נכון, שיט. הם הסירו לי את הגישות אז הפקודה הזו לא עובדת יותר. אל דאגה! כמו כל האקר טוב (שפורץ לאתרים ורשתות בצורה חוקית בלבד, פרט לאנשים שמאוד מעצבנים אותי), אני הכנסתי באקדור לקוד של התיבה. תנסו לפתוח את הקונסולה, יש פרצה בקוד שהשארתי. סומך עליכם!";
    } else {
      str = "אין תיבה באיזור.";
    }
    user.searchChest = false;
  } else if (user.danielTile > -1 && user.askAboutRope == true) {
    str =
      user.danielTile >= danielRopeDialogue.length
        ? danielRopeDialogue[danielRopeDialogue.length - 1]
        : danielRopeDialogue[user.danielTile];
  } else if (user.danielTile > -1) {
    str =
      user.danielTile >= danielDialogue.length
        ? danielDialogue[danielDialogue.length - 1]
        : danielDialogue[user.danielTile];
  } else if (user.minisTile > -1 && user.minisBlock) {
    str = "*מיניס לסרב לשוחח איתכם.*";
  } else if (
    user.minisTile >= 2 &&
    user.minisTile <= 5 &&
    user.minis_response > 0
  ) {
    if (user.minis_response == 1) {
      str =
        "כןןןןן......... *אהמ*.. תראו אני יכול להסביר את זה, אוקיי בעצם אני לא, סליחה שאני צפיתי באור ולי מתעללים בכם בזמן שצפתי ונהנתי בים..";
    } else {
      str = "אה! אז... אמ.. אוקיי אין בעיה! לא משנה!";
    }
    user.minisTile = 8;
    user.minis_response = 0;
  } else if (user.minisTile > -1) {
    str =
      user.minisTile >= minisDialogue.length
        ? minisDialogue[minisDialogue.length - 1]
        : minisDialogue[user.minisTile];
  } else if (user.holtTile >= 0) {
    str =
      user.holtTile >= holtDialogue.length
        ? holtDialogue[holtDialogue.length - 1]
        : holtDialogue[user.holtTile];
  } else if (user.tomTile > -1) {
    if (user.sugar == true) {
      if (user.canTeleport) {
        str =
          "תום: תודות רבות שוב! או כמו שחברי הטוב תהלים היה אומר: הוֹדוּ לַה' כִּי-טוֹב, כִּי לְעוֹלָם חַסְדּוֹ.";
      } else {
        str =
          "תום: מצאתם את הסוכר? *שמאלה* בהולצמן? אור הערור הזה! אלף ואחת קללות יפלו עליו! ובכן, אנוכי איננו זקוק לפורטל יותר. הרגישו חופשי להשתמש בו.";
      }
      user.canTeleport = true;
    } else {
      str =
        user.tomTile >= tomDialogue.length
          ? tomDialogue[tomDialogue.length - 1]
          : tomDialogue[user.tomTile];
    }
    if (str.includes("קיבלתם את המכשיר")) {
      user.device = true;
    }
  } else if (user.leeTile > -1) {
    if (user.leePassed) {
      str =
        user.leeTile >= leePassedDialogue.length
          ? leePassedDialogue[leePassedDialogue.length - 1]
          : leePassedDialogue[user.leeTile];
      if (user.leeTile >= leePassedDialogue.length) {
        user.beatLee = true;
      }
    } else {
      str =
        user.leeTile >= leeDialogue.length
          ? leeDialogue[leeDialogue.length - 1]
          : leeDialogue[user.leeTile];
    }
  } else if (user.orTile > 6) {
    if (
      user.orNotes[0] == true &&
      user.orNotes[1] == true &&
      user.orNotes[2] == true
    ) {
      str =
        user.orTile >= OrPassedDialogue.length
          ? OrPassedDialogue[OrPassedDialogue.length - 1]
          : OrPassedDialogue[user.orTile];
      if (user.orTile >= OrPassedDialogue.length) {
        user.beatOr = true;
      }
    } else {
      str =
        user.orTile >= orDialogue.length
          ? orDialogue[orDialogue.length - 1]
          : orDialogue[user.orTile];
    }
  } else {
    str = emptyDialogue[Math.floor(Math.random() * emptyDialogue.length)];
  }

  if (user.beatOr && user.beatLee) {
    user.passedGameTile++;
    str =
      user.passedGameTile >= PassedGameDialogue.length
        ? PassedGameDialogue[PassedGameDialogue.length - 1]
        : PassedGameDialogue[user.passedGameTile];
  }

  let finalStr = `${str}\n${
    user.device &&
    Math.abs(user.location.x) < 21 &&
    Math.abs(user.location.y) < 21
      ? `${map1.get(user.location.x)}, ${user.location.y}\n`
      : ""
  }
      ברשותכם ${user.torches} לפידים.`;

  user.lastMessage = finalStr;
  return finalStr;
}

const map1: Map<number, string> = new Map([
  [-10, "O"],
  [-9, "B"],
  [-8, "M"],
  [-7, "N"],
  [-6, "A"],
  [-5, "J"],
  [-4, "K"],
  [-3, "L"],
  [-2, "C"],
  [-1, "P"],
  [0, "Q"],
  [10, "Æ"],
  [9, "S"],
  [8, "T"],
  [7, "D"],
  [6, "F"],
  [5, "G"],
  [4, "H"],
  [17, "E"],
  [2, "I"],
  [1, "U"],
  [11, "V"],
  [-11, "W"],
  [-12, "X"],
  [12, "R"],
  [13, "é"],
  [14, "ø"],
  [15, "Ƃ"],
  [16, "ſ"],
  [17, "Œ"],
  [18, "Ɵ"],
  [19, "Ż"],
  [20, "Ĉ"],
  [-13, "é"],
  [-14, "î"],
  [-15, "Ƹ"],
  [-16, "Ǧ"],
  [-17, "Ǎ"],
  [-18, "Y"], // AE - OR -18?
  [-19, "Ƕ"],
  [-20, "Ȑ"],
]);
function handleMovement(userId: string, moveX: number, moveY: number) {
  let user = users.get(userId);
  if (user == null) {
    return;
  }
  user.location.x += moveX;
  user.location.y += moveY;

  // Daniel tile
  if (user.location.x == 0 && user.location.y == -1) {
    user.danielTile++;
  } else {
    user.danielTile = -1;
  }

  // Minis tile
  if (user.location.x == -11 && user.location.y == 3) {
    user.minisTile++;
  } else {
    user.minisTile = -1;
  }

  // Holtzmann tile
  if (user.location.x == 5 && user.location.y == 7) {
    user.holtTile++;
  } else {
    user.holtTile = -1;
  }

  // Tom tile
  if (user.location.x == 6 && user.location.y == 7) {
    user.tomTile++;
  } else {
    user.tomTile = -1;
  }

  // Lee tile
  if (user.location.x == -6 && user.location.y == -9) {
    user.leeTile++;
  } else {
    user.leeTile = -1;
  }

  // Or tile
  if (user.location.x == 10 && user.location.y == 0) {
    user.orTile++;
  } else {
    user.orTile = -1;
  }

  // Or music tiles
  // A x:-6,y:3
  // A x:-6,y:1
  // E x:17,y:5
  if (user.location.x == -6 && user.location.y == -3) {
    if (user.orNotes[0] == false) {
      user.orFoundNote = true;
    }
    user.orNotes[0] = true;
  } else if (user.location.x == -6 && user.location.y == 1) {
    if (user.orNotes[1] == false) {
      user.orFoundNote = true;
    }
    user.orNotes[1] = true;
  } else if (user.location.x == 17 && user.location.y == 5) {
    if (user.orNotes[2] == false) {
      user.orFoundNote = true;
    }
    user.orNotes[2] = true;
  }
}
export async function POST(request: Request) {
  if (request == null) {
    return new Response("Invalid", { status: 400 });
  }
  const data = await request.json();
  if (data == null) {
    return new Response("Invalid", { status: 400 });
  }
  const cookieStore = cookies();
  let userId = (await cookieStore).get("userId")?.value;
  let LeePassed =
    (await cookieStore).get("advanceToRiddle2")?.value == "step2_puppet";
  if (
    data.command == "/lastmessage" &&
    (userId == null || !users.has(userId))
  ) {
    return new Response("Invalid", { status: 400 });
  }
  if (userId == null) {
    userId = generateRandomString();
    (await cookieStore).set("userId", userId, {
      httpOnly: true,
      path: "/api/commands/command",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 100000000000,
    });
  }

  if (!users.has(userId)) {
    resetUser(userId, false);
  }
  handleCommand(userId, data.command, LeePassed);
  //revalidatePath("/");
  //
  let response = sendResponseString(userId);
  if (response.includes("לאאאאא")) {
    return Response.json("FINISH_finale_owari");
  }
  return Response.json(response);
}
