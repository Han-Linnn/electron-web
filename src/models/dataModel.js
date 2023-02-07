import { useState } from 'react';

export default function useAuthModel() {
  const [currentUser, setUserInfo] = useState({});
  const [dictData, setDictData] = useState([]);

  const saveUserInfo = (data) => {
    setUserInfo(data);
  };

  const saveDictData = (data) => {
    setDictData(data);
  };

  const getIdByDictType = (label) => {
    let tempId = -1;
    if (dictData.length > 0 && label) {
      for (let i = 0; i < dictData.length; i += 1) {
        if (dictData[i].label === label) {
          tempId = dictData[i].id;
          break;
        }
      }
    }
    return tempId;
  };

  return {
    currentUser,
    saveUserInfo,
    saveDictData,
    getIdByDictType,
  };
}
