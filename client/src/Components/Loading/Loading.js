import React from 'react';
import {Spinner} from 'react-bootstrap';

function Loading(){
    return (
        <>
        <Spinner
            as="span"
            animation="grow"
            size="lg"
            role="status"
            aria-hidden="true"
            variant="light"
            style={{width:'100%', height:'100%'}}
        >
        </Spinner>
        <span className="sr-only">Processing</span>
        </>
    )
}

export default Loading