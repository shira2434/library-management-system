# מערכת ניהול ספרייה

## 1. נושא הפרויקט
מערכת ניהול ספרייה דיגיטלית המיועדת לניהול ספרים יהודיים ודתיים. המערכת מאפשרת חיפוש, הוספה, עדכון ומחיקה של ספרים, כולל מעקב אחר מיקום הספרים בספרייה וסטטוס הזמינות שלהם.

## 2. תיאור 3 הטבלאות והקשרים

### טבלת Books (ספרים)
- **ID** - מזהה ייחודי של הספר (מפתח ראשי)
- **Title** - שם הספר
- **Author** - שם המחבר
- **Category** - קטגוריית הספר (ספרי קודש, חינוך, ילדים וכו')
- **Description** - תיאור הספר
- **StatusId** - מזהה הסטטוס (מפתח זר לטבלת Statuses)
- **PublishYear** - שנת הוצאה
- **AvailableCopies** - מספר עותקים זמינים
- **LocationId** - מזהה המיקום (מפתח זר לטבלת Locations)
- **CreatedAt** - תאריך יצירה

### טבלת Statuses (סטטוסים)
- **ID** - מזהה ייחודי של הסטטוס (מפתח ראשי)
- **Name** - שם הסטטוס (זמין, לא זמין, ממתין להשאלה)
- **Description** - תיאור הסטטוס

### טבלת Locations (מיקומים)
- **ID** - מזהה ייחודי של המיקום (מפתח ראשי)
- **LocationName** - שם המיקום (מדף ספרי קודש, מדף ספרי חינוך וכו')
- **Description** - תיאור המיקום

### קשרים בין הטבלאות:
- **Books → Statuses**: קשר One-to-Many (ספר אחד יכול להיות בסטטוס אחד, סטטוס אחד יכול להיות לכמה ספרים)
- **Books → Locations**: קשר One-to-Many (ספר אחד נמצא במיקום אחד, מיקום אחד יכול להכיל כמה ספרים)

## 3. רשימת Stored Procedures

1. **Books_GetById** - קבלת ספר לפי ID
2. **GetAllBooks** - קבלת כל הספרים
3. **GetAllStatuses** - קבלת כל הסטטוסים
4. **GetAllLocations** - קבלת כל המיקומים
5. **SearchBooks** - חיפוש ספרים לפי טקסט (בכותרת, מחבר, קטגוריה או תיאור)
6. **AddBook** - הוספת ספר חדש
7. **UpdateBookById** - עדכון ספר קיים
8. **DeleteBook** - מחיקת ספר
9. **ChangeStatus** - שינוי סטטוס ספר

## 4. ארכיטקטורת המערכת

### זרימת הנתונים
```
Angular (Client) ↔ API (.NET) ↔ SQL Server
```

**תהליך הבקשה:**
1. הלקוח (Angular) שולח בקשה HTTP דרך ApiService המרכזי
2. ה-API משמש כצינור ומעביר את הבקשה ל-Stored Procedure המתאימה
3. SQL Server מבצע את כל הלוגיקה ומחזיר תוצאות
4. ה-API מחזיר נתונים בפורמט JSON ל-ApiService
5. ה-ApiService מעביר את הנתונים לקומפוננטים

### שכבה 1: מסד הנתונים (SQL Server)
- **טבלה ראשית**: Books (ספרים)
- **טבלת עזר 1**: Statuses (סטטוסים)
- **טבלת עזר 2**: Locations (מיקומים)
- **Stored Procedures - כל הלוגיקה**: 9 פרוצדורות לביצוע פעולות CRUD וחיפוש

### שכבה 2: API (.NET Core) - צינור Endpoints
- **תפקיד**: משמש כצינור בלבד להעברת בקשות ל-Stored Procedures
- **Controller**: ExecController עם POST /api/exec
- **Models**: ExecuteRequest (עם procedureName + parameters)
- **Connection**: SqlConnection עם connection string
- **Response**: JSON format

### שכבה 3: צד לקוח (Angular)
- **Service מרכזי**: ApiService אחד לכל התקשורת עם ה-API
- **Components**: book-list, book-form, book-details
- **Models**: Book, Status, Location
- **HTTP Requests**: GET, POST, PUT, DELETE

### דוגמה לזרימת נתונים
```
1. Angular Component: קורא ל-ApiService.getAllBooks()
2. ApiService: POST /api/exec עם { procedureName: "GetAllBooks", parameters: {} }
3. ExecController: מריץ EXEC GetAllBooks
4. SQL Server: מבצע את כל הלוגיקה ומחזיר נתונים
5. API: מחזיר JSON ל-ApiService
6. Component: מציג את רשימת הספרים
```

## 5. איך מריצים את צד השרת וצד הלקוח

### הגדרת בסיס הנתונים
1. פתח את SQL Server Management Studio
2. צור בסיס נתונים חדש בשם `LibraryDB`
3. הרץ את הקובץ `DB/tables_and_data.sql` כדי ליצור את הטבלאות והנתונים
4. הרץ את הקובץ `DB/stored_procedures.sql` כדי ליצור את ה-Stored Procedures

### הרצת צד השרת (API)
1. פתח את התיקייה `api\LibraryAPI` ב-Command Prompt או PowerShell
2. הרץ את הפקודה:
   ```
   dotnet run --urls "http://localhost:5001"
   ```
3. השרת יעלה על הכתובת: `http://localhost:5001`

### הרצת צד הלקוח (Client)
1. פתח את התיקייה `client` ב-Command Prompt או PowerShell
2. התקן את התלויות:
   ```
   npm install
   ```
3. הרץ את האפליקציה:
   ```
   npm start
   ```
4. האפליקציה תיפתח בדפדפן בכתובת: `http://localhost:4200`

### דרישות מערכת
- .NET 9.0 או גרסה חדשה יותר
- Node.js 18 או גרסה חדשה יותר
- Angular CLI
- SQL Server
- SQL Server Management Studio (אופציונלי)

## מבנה הפרויקט
```
PRAKTIKUM/
├── api/
│   └── LibraryAPI/         # צד השרת (ASP.NET Core Web API)
├── client/                 # צד הלקוח (Angular)
├── DB/
│   ├── tables_and_data.sql # טבלאות ונתונים
│   └── stored_procedures.sql # פרוצדורות
└── README.md              # קובץ זה
```