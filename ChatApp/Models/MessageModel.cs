namespace ChatApp.Models
{
    public class MessageModel
    {
        public int MessageId { get; set; }
        public string SenderMail { get; set; }
        public string ReceiverMail { get; set; }
        public string Content { get; set; }
        public DateTime TimeStamp { get; set; } = DateTime.UtcNow;
    }
}
