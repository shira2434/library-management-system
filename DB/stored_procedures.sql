-- Stored Procedures לפרויקט ניהול ספרייה

USE LibraryDB
GO

-- קבלת ספר לפי ID
CREATE PROCEDURE Books_GetById
    @Id INT
AS
BEGIN
    SELECT 
        b.ID, b.Title, b.Author, b.Category, b.Description,
        b.PublishYear, b.AvailableCopies, b.StatusId, b.LocationId,
        s.Name AS StatusName, l.LocationName
    FROM Books b
    LEFT JOIN Statuses s ON b.StatusId = s.ID 
    LEFT JOIN Locations l ON b.LocationId = l.ID
    WHERE b.ID = @Id
END
GO

-- קבלת כל הספרים
ALTER PROCEDURE GetAllBooks
AS
BEGIN
    SELECT 
        b.ID, b.Title, b.Author, b.Category, b.Description,
        b.PublishYear, b.AvailableCopies, b.StatusId, b.LocationId,
        s.Name AS StatusName, l.LocationName
    FROM Books b
    LEFT JOIN Statuses s ON b.StatusId = s.ID 
    LEFT JOIN Locations l ON b.LocationId = l.ID
    ORDER BY b.Title
END
GO


-- קבלת כל הסטטוסים
CREATE PROCEDURE GetAllStatuses
AS
BEGIN
    SELECT ID, Name, Description FROM Statuses
END
GO

-- קבלת כל המיקומים
CREATE PROCEDURE GetAllLocations
AS
BEGIN
    SELECT ID, LocationName, Description FROM Locations
END
GO

-- חיפוש ספרים
CREATE PROCEDURE SearchBooks
    @SearchText NVARCHAR(255) = ''
AS
BEGIN
    SELECT 
        b.ID, b.Title, b.Author, b.Category, b.Description,
        b.PublishYear, b.AvailableCopies, b.StatusId, b.LocationId,
        s.Name AS StatusName, l.LocationName
    FROM Books b
    LEFT JOIN Statuses s ON b.StatusId = s.ID 
    LEFT JOIN Locations l ON b.LocationId = l.ID
    WHERE 
        (@SearchText = '' OR @SearchText IS NULL)
        OR (
            b.Title LIKE N'%' + @SearchText + '%' 
            OR b.Author LIKE N'%' + @SearchText + '%'
            OR b.Category LIKE N'%' + @SearchText + '%'
            OR b.Description LIKE N'%' + @SearchText + '%'
        )
    ORDER BY b.Title
END
GO

CREATE PROCEDURE AddBook
    @Title NVARCHAR(255), @Author NVARCHAR(255), @Category NVARCHAR(100),
    @Description NVARCHAR(999), @StatusId INT, @PublishYear INT,
    @AvailableCopies INT, @LocationId INT
AS
BEGIN
    DECLARE @NewId INT
    SELECT @NewId = ISNULL(MAX(ID), 0) + 1 FROM Books
    
    INSERT INTO Books (ID, Title, Author, Category, Description, StatusId, PublishYear, AvailableCopies, LocationId, CreatedAt)
    VALUES (@NewId, @Title, @Author, @Category, @Description, @StatusId, @PublishYear, @AvailableCopies, @LocationId, GETDATE())
    
    SELECT 
        b.ID, b.Title, b.Author, b.Category, b.Description,
        b.PublishYear, b.AvailableCopies, b.StatusId, b.LocationId,
        s.Name AS StatusName, l.LocationName
    FROM Books b
    LEFT JOIN Statuses s ON b.StatusId = s.ID 
    LEFT JOIN Locations l ON b.LocationId = l.ID
    WHERE b.ID = @NewId
END


-- עדכון ספר קיים  
CREATE PROCEDURE UpdateBookById
    @ID INT, @Title NVARCHAR(255), @Author NVARCHAR(255), @Category NVARCHAR(100),
    @Description NVARCHAR(999), @StatusId INT, @PublishYear INT,
    @AvailableCopies INT, @LocationId INT
AS
BEGIN
    UPDATE Books
    SET Title = @Title, Author = @Author, Category = @Category, Description = @Description,
        StatusId = @StatusId, PublishYear = @PublishYear, AvailableCopies = @AvailableCopies, LocationId = @LocationId
    WHERE ID = @ID
    
    SELECT 
        b.ID, b.Title, b.Author, b.Category, b.Description,
        b.PublishYear, b.AvailableCopies, b.StatusId, b.LocationId,
        s.Name AS StatusName, l.LocationName
    FROM Books b
    LEFT JOIN Statuses s ON b.StatusId = s.ID 
    LEFT JOIN Locations l ON b.LocationId = l.ID
    WHERE b.ID = @ID
END
GO

-- מחיקת ספר
CREATE PROCEDURE DeleteBook
    @BookId INT
AS
BEGIN
    DELETE FROM Books WHERE ID = @BookId;
END
GO

-- שינוי סטטוס ספר
CREATE PROCEDURE ChangeStatus
    @BookID INT, @NewStatusID INT
AS
BEGIN
    UPDATE Books SET StatusId = @NewStatusID WHERE ID = @BookID;
END
GO

-- קבלת כל הקטגוריות
CREATE PROCEDURE GetAllCategories
AS
BEGIN
    SELECT DISTINCT Category FROM Books WHERE Category IS NOT NULL ORDER BY Category
END
GO





EXEC GetAllCategories



