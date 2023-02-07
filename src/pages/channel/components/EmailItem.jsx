/*
// 邮箱列表的渲染子项组件(未处理)
*/

// const CustomCol = (props) => {
//   const { num1, num2, children } = props;
//   // num[8:每行3个, 12:2个]
//   return (
//     <Col xs={24} sm={24} md={num1} lg={num1} xl={num2}>
//       {children}
//     </Col>
//   );
// };

// const renderEmailList = () => {
//   const Item = (props) => {
//     const { name } = props;
//     return (
//       <div className={styles.email_item}>
//         <div style={{ float: 'left', display: 'flex' }}>
//           <img src="./icons/email.png" alt="icon" style={{ marginTop: '3px' }} />
//           <p className={styles.email_name} style={{ marginLeft: '15px', marginTop: '5px' }}>
//             {name}
//           </p>
//         </div>

//         <div style={{ float: 'right', display: 'flex' }}>
//           <button
//             className={`button button-light-blue ${styles.email_button}`}
//             onClick={() => {
//               // TODO 等待接口
//               setEmailData({
//                 email: 'feng.pan@que360.com',
//                 serves: 'imap.que.360.com',
//                 emailType: 'POP3',
//               });
//               setEmailVisible(true);
//             }}
//           >
//             邮箱设置
//           </button>
//           <button className={`button button-orange ${styles.email_button}`}>同步简历</button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <div style={{ marginTop: '40px' }}>
//         <p className={styles.email_title}>邮箱简历同步</p>
//         <button className="button button-orange">新 增</button>
//       </div>
//       <Row gutter={24}>
//         <CustomCol num1={12} num2={12}>
//           <Item name="feng.pan@que360.com" />
//         </CustomCol>
//         <CustomCol num1={12} num2={12}>
//           <Item name="feng.pan@que360.com" />
//         </CustomCol>
//       </Row>
//     </>
//   );
// };
