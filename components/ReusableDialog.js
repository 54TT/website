import React from "react";
import {Modal} from 'antd'
function ReusableDialog({
  title,
  action,
  item,
  open,
  handleClose,
  handleAgree,
  handleDisagree,
}) {
  return (
      <>
      <Modal title={`${title}`} open={open} destroyOnClose={true} onOk={handleAgree} onCancel={handleClose}>
        <p>   {`Are you sure you want to ${action} this ${item}?`}</p>
      </Modal>
      </>
  );
}

export default ReusableDialog;
