const result = {
  return_code : '00',
  return_info : '操作成功',
  return_data : {
    totalRow : 4,
    pageNumber : 1,
    firstPage : true,
    lastPage : true,
    totalPage : 1,
    pageSize : 15,
    list : [
      {
        id: 101,
        name: '聚义堂',
        mobile: '莲花餐饮',
        zhiwei: '07:00 ~ 08:00',
        bumen: '12:00 ~ 13:00',
        status: '18:00 ~ 20:00',
        createTime: '1519629374000',
      },
      {
        id: 102,
        name: '聚贤堂',
        mobile: '莲花餐饮',
        zhiwei: '07:00 ~ 08:00',
        bumen: '12:00 ~ 13:00',
        status: '18:00 ~ 20:00',
        createTime: '1519629374000',
      },
      {
        id: 103,
        name: '龙虎堂',
        mobile: '莲花餐饮',
        zhiwei: '07:00 ~ 08:00',
        bumen: '12:00 ~ 13:00',
        status: '18:00 ~ 20:00',
        createTime: '1519629374000',
      },
      {
        id: 104,
        name: '忠义堂',
        mobile: '莲花餐饮',
        zhiwei: '07:00 ~ 08:00',
        bumen: '12:00 ~ 13:00',
        status: '18:00 ~ 20:00',
        createTime: '1520503368000',
      }
    ],
    desc : null
  },
  token : '',
  success : true
}

export default {
  'get /api/mealsection': (req, res) => {
    res.send(result.return_data);
  },
  'post /api/mealsection': (req, res) => {
    res.send(result.return_data);
  }
};