import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const AddInventoryRecord = (props) => {

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>{props.product.name_english.toUpperCase()} - Add Inventory</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            </Modal.Body>
                Stuff goes here
            <Modal.Footer>
                <Button variant="secondary" onClick={props.closeModal}>
                    Close
            </Button>
            </Modal.Footer>
        </>
    )
}

export default AddInventoryRecord;