import React from 'react'
import { Modal, Button } from "react-bootstrap";
 
const DeleteConfirmation = ({ showModal, hideModal, confirmModal, deleteid, message }) => {
    return (
        <Modal show={showModal} onHide={hideModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>削除確認</Modal.Title>
        </Modal.Header>
        <Modal.Body><div className="alert alert-danger">{message}</div></Modal.Body>
        <Modal.Footer>
          <Button variant="default" onClick={hideModal}>
          取消
          </Button>
          <Button variant="danger" onClick={() => confirmModal(deleteid) }>
          消す
          </Button>
        </Modal.Footer>
      </Modal>
    )
}
 
export default DeleteConfirmation;