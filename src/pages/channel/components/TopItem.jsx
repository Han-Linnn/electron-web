/*
// 顶部功能按钮列表的渲染子项组件(未处理)
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

// const renderTopItem = () => {
//   const Item = (props) => {
//     const { title, img, onClick } = props;
//     return (
//       <div className={styles.topItem} onClick={onClick}>
//         <span>
//           <img src={img} alt="icon" />
//           &nbsp;&nbsp;{title}
//         </span>
//       </div>
//     );
//   };

//   return (
//     <Row gutter={RowGutter}>
//       <CustomCol num1={12}>
//         <Item
//           title="一键发布职位"
//           img="./icons/icon-128x128.png"
//           onClick={() => {
//             setPostVisible(true);
//           }}
//         />
//       </CustomCol>
//       <CustomCol num1={12}>
//         <Item
//           title="一键同步渠道简历"
//           img="./icons/icon-128x128.png"
//           onClick={() => {
//             console.log('-3-');
//           }}
//         />
//       </CustomCol>
//     </Row>
//   );
// };
