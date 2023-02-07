import { useEffect, useState } from 'react';

const DBName = 'CrawlerDB';
const OSName = 'CrawlerOS';
const Version = 1;

export default function DBModel() {
  const [db, setDB] = useState(null);

  const promisify = (request) => {
    return new Promise((resolve) => {
      request.onsuccess = (e) => {
        resolve(e.target.result);
      };
      request.onerror = () => {
        resolve(null);
        console.log('DB request error');
      };
    });
  };

  const initDB = async () => {
    console.log('--initDB--');
    const request = window.indexedDB.open(DBName, Version);
    request.onupgradeneeded = (event) => {
      const tempDB = event.target.result;
      if (!tempDB.objectStoreNames.contains(OSName)) {
        const objectStore = tempDB.createObjectStore(OSName, {
          keyPath: 'id',
          autoIncrement: true,
        });
        objectStore.createIndex('id', 'id', { unique: true });
        objectStore.createIndex('uId', 'uId', { unique: true });
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('updateTime', 'updateTime', { unique: false });
        objectStore.createIndex('channel', 'channel', { unique: false });

        objectStore.createIndex('detailed', ['name', 'updateTime', 'channel'], { unique: false });
      }
    };
    const result = await promisify(request);
    if (result) {
      setDB(result);
    }
  };

  useEffect(() => {
    // initDB();
  }, []);

  // 更新数据
  const setData = async (params) => {
    if (db) {
      // 新建‘OSName’数据库事务
      const transaction = db.transaction([OSName], 'readwrite');
      // 通过事务读取所有数据
      const objectStore = transaction.objectStore(OSName);
      const request = objectStore.getAll();
      // 监听连接对象的success事件，完成数据更新
      request.onsuccess = () => {
        const dbData = request.result;
        const osRrequest = objectStore.put({
          id: dbData.length + 1,
          uId: dbData.length + 1,
          // uId: params?.uId,
          // TODO 测试参数
          name: params?.name,
          updateTime: params?.updateTime,
          channel: params?.channel,
        });
        return promisify(osRrequest);
      };
    }
  };

  // 查询数据
  const getData = async () => {
    if (db) {
      const transaction = db.transaction([OSName]);
      const objectStore = transaction.objectStore(OSName);
      const request = objectStore.getAll();
      const result = await promisify(request);
      return result;
    }
    return null;
  };

  // 遍历数据（字段：id）
  const checkuIdDB = async (uId) => {
    if (db) {
      const transaction = db.transaction([OSName]);
      const objectStore = transaction.objectStore(OSName);
      const index = objectStore.index('uId');
      const request = index.openCursor(IDBKeyRange.only(uId));
      const cursor = await promisify(request);
      let temp = null;
      if (cursor) {
        temp = cursor.value;
        cursor.continue();
      }
      return temp;
    }
    return null;
  };

  // params=[a,b]  //遍历数据（字段：detail）
  const checkDetailedDB = async (params) => {
    if (db) {
      const transaction = db.transaction([OSName]);
      const objectStore = transaction.objectStore(OSName);
      const index = objectStore.index('detailed');
      const request = index.openCursor(IDBKeyRange.only(params));
      const cursor = await promisify(request);
      const temp = [];
      if (cursor) {
        temp.push(cursor.value);
        cursor.continue();
      }
      return temp;
    }
    return null;
  };

  // 删除数据库
  const deleteDB = () => {
    const request = indexedDB.deleteDatabase(DBName);
    request.onsuccess = () => {
      console.log('Deleted database successfully');
    };
    request.onerror = () => {
      console.log("Couldn't delete database");
    };
    request.onblocked = () => {
      console.log("Couldn't delete database due to the operation being blocked");
    };
  };

  return {
    setData,
    getData,
    checkuIdDB,
    checkDetailedDB,
    // ----
    deleteDB,
  };
}
