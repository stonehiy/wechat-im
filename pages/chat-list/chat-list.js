// pages/chat-list/chat-list.js

/**
 * 会话列表页面
 */
Page({
  /**
   * 页面的初始数据
   */
  data: {
    /*
       
    */
    conversations: [
      {
        friendId: "666666",
        friendHeadUrl:
          "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3155998395,3600507640&fm=26&gp=0.jpg",
        unread: "2",
        friendName: "小明",
        content: "",
        timeStr: "",
      },
      {
        friendId: "77777",
        friendHeadUrl:
          "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn11%2F600%2Fw700h700%2F20180424%2F514b-fzqvvsa3694420.jpg&refer=http%3A%2F%2Fn.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622017552&t=0c51c2aedb57456f2e057e263e43ad38",
        unread: "3",
        friendName: "小红",
        content: "",
        timeStr: "",
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  toChat(e) {
    let item = e.currentTarget.dataset.item;
    delete item.latestMsg;
    delete item.unread;
    delete item.content;
    delete item.friendHeadUrl;

    wx.navigateTo({
      url: `../chat/chat?friend=${JSON.stringify(item)}`,
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    const that = this;
    getApp()
      .getIMHandler()
      .setOnReceiveMessageListener({
        listener: (msg) => {
          const topic = msg.topic;
          const mm = msg.msg;

          const newItem = {
            friendId: mm.from,
            friendHeadUrl:
              "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3155998395,3600507640&fm=26&gp=0.jpg",
            unread: "1",
            friendName: mm.from,
            content: mm.content,
            timeStr: mm.timestamp,
          };

          that.setData({
            conversations: that.conversationsItem(newItem),
          });
        },
      });
    // try {
    //     await getApp().getIMHandler().sendMsg({
    //         content: {
    //             type: 'get-conversations',
    //             userId: getApp().globalData.userInfo.userId
    //         }
    //     });
    //     console.log('获取会话列表消息发送成功');
    // } catch (e) {
    //     console.log('获取会话列表失败', e);
    // }
  },

  conversationsItem(newItem) {
    let list = this.data.conversations;
 
    list = list.filter((item) => {
      if (item.friendId == newItem.friendId) {
        newItem.unread = item.unread + 1;
        return false;
      } else {
        return true;
      }
    });
    Array.prototype.push.apply(list, [newItem]);
    console.log("list = ",list);
    return list;
  },
  getConversationsItem(item) {
    let { latestMsg, ...msg } = item;
    return Object.assign(msg, JSON.parse(latestMsg));
  },
});
