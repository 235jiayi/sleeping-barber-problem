async function multiBarber(
  HairCutList,
  LeaveList,
  CHAIRS,
  numBarbers,
  numConsumers
) {
  const barberList = [];
  for (let i = 0; i < numBarbers; i++) {
    barberList.push([]);
  }
  const sem = require("async-sema"); // 引入async-sema库，用于实现信号量功能
  const promises = [];
  const pBarbers = [];
  const waitQueue = []; // 等待队列，保存等待理发的顾客编号
  for (let i = 0; i < CHAIRS; i++) {
    waitQueue.push({
      flag: false,
      data: {},
    });
  }
  let waiting = 0; // 等待理发的顾客数
  let time = 0;

  const barbers = [];
  for (let i = 0; i < numBarbers; i++) {
    barbers.push(new sem.Sema(0)); // 理发师信号量数组，初始值为0，表示没有顾客需要理发
  }

  const consumers = new sem.Sema(0); // 顾客信号量，初始值为0，表示没有顾客需要理发
  const mutexLock = new sem.Sema(1); // 互斥锁信号量，初始值为1，表示未加锁状态
  const interVal1 = setInterval(() => {
    time++;
    if (time > numConsumers * 10) {
      // console.log("------理发名单------");
      // console.table(HairCutList);
      // console.log("------离开名单------");
      // console.table(LeaveList);
      clearInterval(interVal1);
    }
  }, 1);
  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms)); // 实现延时效果的函数
  };
  const selectChair = (j) => {
    if (j == 1)
      for (let i in waitQueue) {
        if (waitQueue[i].flag == false) {
          return i;
        }
      }
    else {
      let minTime = 1000;
      let minNum = 0;
      for (let i in waitQueue) {
        if (waitQueue[i].data.time < minTime && waitQueue[i].flag == true) {
          minNum = i;
          minTime = waitQueue[i].data.time;
        }
      }
      return minNum;
    }
  };
  async function barberProcess(barberId) {
    while (true) {
      await consumers.acquire(); // 等待有顾客需要理发
      await mutexLock.acquire(); // 获取互斥锁，保证等待人数和等待队列的操作不会同时进行
      waiting--;
      const i = selectChair(0);
      waitQueue[i].flag = false;
      const co = waitQueue[i].data;
      const id = co.id;
      const chair = co.chair;
      const arriveTime = co.time;
      mutexLock.release(); // 释放互斥锁
      barbers[barberId].release(); // 释放该理发师的信号量，表示该理发师可以开始理发
      // console.log(`理发师${barberId}正在给第${id}位等待的顾客理发`); // 输出相关信息
      let beginTime = time;
      await sleep(Math.floor(Math.random() * 20) + 12); // 模拟理发的时间
      // console.log(`第${id}位等待的顾客理发完成`);
      if (beginTime != arriveTime) {
        const wait = `在椅子${chair}等待${beginTime - arriveTime}`;
        HairCutList.push({
          barberUid: barberId,
          customUid: id,
          arriveTime,
          isWait: true,
          chair,
          wait,
          beginTime,
          leaveTime: time,
        });
      } else {
        HairCutList.push({
          barberUid: barberId,
          customUid: id,
          arriveTime,
          isWait: false,
          chair: NaN,
          wait: "并未等待",
          beginTime,
          leaveTime: time,
        });
      }
      barberList[barberId].push({
        customUid: id,
        barberUid: barberId,
        beginTime,
        leaveTime: time,
      });
    }
  }

  async function consumerProcess(i) {
    await mutexLock.acquire(); // 获取互斥锁，保证等待人数和等待队列的操作不会同时进行
    if (waiting < CHAIRS) {
      // 如果等待人数小于椅子数
      let chair = selectChair(1);
      waitQueue[chair].flag = true;
      waitQueue[chair].data = {
        time,
        id: i,
        chair,
      }; // 将该顾客的编号加入等待队列
      waiting++; // 增加等待人数
      mutexLock.release(); // 释放互斥锁
      consumers.release(); // 释放顾客信号量，等待理发师的理发
      // console.log(`第${i}位顾客来了，正在接受理发师的理发服务`);
      // console.log(`正在等待理发师理发的顾客还有${waiting}位\n`);
      // 等待空闲的理发师
      const barberId = await Promise.race(
        barbers.map((barber, index) => {
          return barber.acquire().then(() => index);
        })
      );
      // console.log(`理发师${barberId}正在为第${i}位顾客理发`);
    } else {
      mutexLock.release(); // 释放互斥锁
      // console.log(`门外的第${i}位顾客看见没有椅子就转身走了\n`);
      LeaveList.push({ customUid: i, leaveTime: time });
    }
  }
  for (let i = 0; i < numBarbers; i++) {
    pBarbers.push(barberProcess(i)); // 启动多个理发师进程
  }
  for (let i = 0; i < numConsumers; i++) {
    // 启动多个顾客进程
    promises.push(consumerProcess(i));
    await sleep(Math.floor(Math.random() * 3) + 1); // 随机等待一段时间后再启动下一个顾客进程
  }
  await sleep(numConsumers * 20);
  // console.table(HairCutList, LeaveList);
  const timeLine = [];
  //1表示顾客到店直接离开
  //2表示顾客坐到椅子上
  //3表示给顾客从椅子上离开去理发
  //4表示顾客直接理发
  //5表示顾客理发结束离开
  for (let i = 0; i < HairCutList[HairCutList.length - 1].leaveTime + 1; i++) {
    timeLine[i] = [];
  }
  for (let i of LeaveList) {
    timeLine[i.leaveTime].push({
      type: 1,
      customUid: i.customUid,
    });
  }
  for (let i of HairCutList) {
    if (!i.isWait) {
      timeLine[i.arriveTime].push({
        type: 4,
        customUid: i.customUid,
        barberUid: i.barberUid,
      });
      timeLine[i.leaveTime].push({
        type: 5,
        customUid: i.customUid,
        barberUid: i.barberUid,
      });
    } else {
      timeLine[i.arriveTime].push({
        type: 2,
        customUid: i.customUid,
        chair: i.chair - 0,
      });
      timeLine[i.beginTime].push({
        type: 3,
        customUid: i.customUid,
        chair: i.chair - 0,
        barberUid: i.barberUid,
      });
      timeLine[i.leaveTime].push({
        type: 5,
        customUid: i.customUid,
        barberUid: i.barberUid,
      });
    }
  }

  for (let i of timeLine) {
    if (i.length > 1) {
      i = i.sort((a, b) => {
        if (a.type == 2 && b.type == 3 && a.chair == b.chair) {
          return 1;
        }
        if (
          (a.type == 3 || a.type == 4) &&
          b.type == 5 &&
          a.barberUid == b.barberUid
        ) {
          return 1;
        }
        if (a.type == 1 && b.type == 2) {
          return -1;
        }
        const typeOrder = { 1: 1, 2: 2, 3: 3 }; // type属性的顺序
        const typeA = typeOrder[a.type] || 4; // 如果a.type不是1,3,5中的任意一个，则默认为4
        const typeB = typeOrder[b.type] || 4; // 如果b.type不是1,3,5中的任意一个，则默认为4
        return typeA - typeB; // 返回按照type属性顺序排序后的结果
      });
    }
  }
  // console.table(HairCutList);
  // console.table(LeaveList);
  // console.log(timeLine);
  return { HairCutList, LeaveList, barberList, timeLine };
}
// multiBarber([], [], 2, 2, 10);
module.exports = multiBarber;
