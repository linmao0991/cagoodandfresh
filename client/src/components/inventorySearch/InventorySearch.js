import React, {useContext, useRef, useEffect, useState} from 'react';
import Api from '../../utils/Api';
import {InputGroup, Button, FormControl} from 'react-bootstrap';
import InventoryContext from '../../context/InventoryContext';

const InventorySearch = (props) => {
    const inventoryContext = useContext(InventoryContext)
    const searchInputRef = useRef(null)
    const [searchTimeout, setSearchTimeout] = useState(false) 

    const searchProductByInput = () => {
        setSearchTimeout(true)
        props.toggleLoading()
        if(props.returnInput){
            props.returnInput(searchInputRef.current.value.trim())
        }
        //This API should be changed to searchProductByInput
        Api.searchInventoryByInput({
            searchInput: searchInputRef.current.value.trim()
        }).then(products => {
            inventoryContext.storeProducts(products.data)
            props.toggleLoaded()
            setSearchTimeout(false)
        })
    }

    return(
        <InputGroup className="mb-3">
            <InputGroup.Prepend>
                <Button disabled={searchTimeout?true:false} variant={searchTimeout?'secondary':'warning'} onClick={searchProductByInput}>Search</Button>
            </InputGroup.Prepend>
            <FormControl
                placeholder="Product Name or ID"
                ref={searchInputRef}
            />
        </InputGroup>
    )
}
export default InventorySearch;