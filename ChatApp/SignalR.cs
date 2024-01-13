using Microsoft.AspNetCore.SignalR;

namespace ChatApp
{
    public class GroupMessageHub : Hub
    {
        public async Task SendUpdateToClients(object updatedData)
        {
            await Clients.All.SendAsync("ReceiveGroupMessage", updatedData);
        }
    }

    public class MessageHub : Hub
    {
        public async Task SendUpdateToClients(object updatedData)
        {
            await Clients.All.SendAsync("Message", updatedData);
        }
    }
}
