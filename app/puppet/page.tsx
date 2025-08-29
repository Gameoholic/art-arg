// riddle 2

/*
// translate button since we're not sure whether people will be doing this in English or Hebrew. Translation might not be 100% accurate we're not very good at that.
// Each component is in a different language but things about it are different


ORIGINAL:
It is not the length of life, but the depth of life. He who is not
everyday conquering some fear has not learned the secret of life.
-Ralph Waldo Emerson
TRANSLATION:
זה לא האורך, אלא העומק של החיים, שמשפיע על איחוט החיים של הפרט.
-ראלף וולדו אמרסון

ORIGINAL:
Message from or and lee: The quote doesn't have anything to do with the riddle, we just thought it sounded cool.
TRANSLATION:
הערה מאור ולי: אין שום *קשר* בין החידה לבין הציטוט, פשוט שמענו את זה בטיול להוואי וחשבנו שהוא נשמע מגניב. וואו השיט לשם בסירה היה מה זה מגניב.
        */

"use client";

export default function Home() {
  return (
    <div dir="rtl">
      <p>
        הרגע חשבנו על זה שיכול להיות שיש דוברי אנגלית שינסו לפתור את החידה ולא
        התחשבנו בהם בכלל, שיט. וגם אין בכלל כאילו רפרזנטציה של התרבות שלהם וזה.
        אוקיי שיט אני שנייה מוצא איזשהו ציטוט בגוגל ועושה לו תרגום שיהיה ברור גם
        לדוברי אנגלית וגם לדוברי עברית. התרגום לא יהיה 1:1 אבל בסדר עדיף מכלום.
      </p>

      <p dir="ltr">
        It is not the length of life, but the depth of life. He who is not
        everyday conquering some fear has not learned the secret of life. -Ralph
        Waldo Emerson
      </p>
    </div>
  );
}
