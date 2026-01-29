namespace LibraryAPI.Models
{
    public class BookRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int StatusId { get; set; }
        public int PublishYear { get; set; }
        public int AvailableCopies { get; set; }
        public int LocationId { get; set; }
    }

    public class StatusChangeRequest
    {
        public int StatusId { get; set; }
    }
}