import React, {useState, useContext} from 'react';
import {Dropdown, Button, InputGroup, Spinner, Badge, FormControl} from 'react-bootstrap'
import Api from '../../utils/Api'
import InventoryContext from '../../context/InventoryContext'

const EditProductDetail = (props) =>{
    const inventoryContext = useContext(InventoryContext)
    const [inputValue, setInputValue] = useState(props.placeholder)
    const [loading, setLoading] = useState(false)
    //const [show, setShow] = useState(false);

    //const handleClose = () => setShow(false);
    //const handleShow = () => setShow(true);

    const inputHandler = value => {
        setInputValue(value)
    }

    const updateProductField = (value) => {
        let fieldValue;
        if(value){
            fieldValue = value
        }else{
            fieldValue = inputValue
        }
        console.log('update')
        setLoading(true)
        console.log('[Submit Input]: '+fieldValue)
        Api.updateProduct({
            id: props.id,
            update: {[props.field]: fieldValue}
        }).then(result => {
            let updatedProducts = [...inventoryContext.products]
            updatedProducts.splice(props.index,1,result.data[0])
            inventoryContext.storeProducts(updatedProducts)
            setLoading(false)
            if(props.divId){
                props.collapse(props.divId)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <Badge
            disabled={loading?true:false}
            variant='warning' 
            size='sm' 
            as='button'
            href=""
            ref={ref}
            onClick={(e) => {
            e.preventDefault();
            onClick(e);
            }}
        >
            {loading?
                <Spinner animation="border" role="status" size='sm'>
                    <span className="sr-only">Loading...</span>
                </Spinner>
            :
                <>{children}&#x25bc;</>
            }
        </Badge>
    ));

    const switchFieldUpdate = () =>{
        switch(props.field){
            case 'name_chinese':
            case 'name_english':
            case 'weight':
            case 'location':
            case 'upc':
            case 'description':
                return(
                    <InputGroup>
                        <FormControl
                        value={inputValue}
                        aria-label={props.label}
                        onChange={(event) => inputHandler(event.target.value)}
                        />
                        <InputGroup.Append>
                            <Button variant="success" onClick={() => updateProductField()}>
                                {loading?
                                <Spinner animation="border" role="status" size='sm'>
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                                :
                                <>✓</>
                                }
                            </Button>
                            <Button variant="danger" disabled={loading?true:false} onClick={() => props.collapse(props.divId)}>✗</Button>
                        </InputGroup.Append>
                    </InputGroup>
                )
            case 'category':
                return(
                <Dropdown>
                    <Dropdown.Toggle as={CustomToggle} >Edit</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {inventoryContext.categories.map((category, index) => {
                            return(
                            <Dropdown.Item
                                key={category+''+index}
                                eventKey={category+''+index}
                                onClick={() =>{
                                    updateProductField(category)
                                }}
                            >
                                {category.toUpperCase()}
                            </Dropdown.Item>
                            )
                        })}
                    </Dropdown.Menu>
                </Dropdown>
                )
            case 'holding':
                return(
                <Dropdown>
                    <Dropdown.Toggle as={CustomToggle} >Edit</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {['refrigeration','frozen','dry'].map((holding, index) => {
                            return(
                            <Dropdown.Item
                                key={holding+''+index}
                                eventKey={holding+''+index}
                                onClick={() =>{
                                    updateProductField(holding)
                                }}
                            >
                                {holding.toUpperCase()}
                            </Dropdown.Item>
                            )
                        })}
                    </Dropdown.Menu>
                </Dropdown>
                )
            default:
                return(
                    null
                )
        }
    }

    return(
        <>
            {switchFieldUpdate()}
        </>
    )
}

export default EditProductDetail;