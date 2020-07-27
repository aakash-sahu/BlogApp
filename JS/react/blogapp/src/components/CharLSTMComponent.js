import React, { useState } from 'react';
import { FormGroup, Label, Input, Form } from 'reactstrap';
import { baseUrl2 } from '../shared/baseUrl';
import { TickerLoading } from './LoadingComponent';

//creating this page using react hooks
export default function CharLSTM() {

    const [inputText, setInputText] = useState("");
    const [outputText, setoutputText] = useState("");
    const [showSpinner, setSpinner] = useState(false);

    function handleInputTextChange(event) {
        setInputText(event.target.value);
        const input = {prime: inputText, num_chars: 5*inputText.length + 20 };
        if (inputText.length >=5 && inputText.length % 3 ===0) {
            setSpinner(true);
            fetch(baseUrl2 + 'get_char_preds', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(input)
            })
            .then(response => response.json())
            .then(response => {
                setoutputText(response.pred);
                setSpinner(false);
            })
            .catch(err => console.log(err))
        }
        if (inputText.length === 0){
            setoutputText('');
        }
    };

    // Getting server response using useEffect Hook
    // useEffect ( () => {
    //     const input = {prime: inputText, num_chars: 5*inputText.length + 20 };
    //     console.log(JSON.stringify(input));
    //     if (inputText.length >=5 && inputText.length % 3 ===0) {
    //         fetch(baseUrl2 + 'get_char_preds', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(input)
    //         })
    //         .then(response => response.json())
    //         .then(response => {
    //             setoutputText(response.pred)
    //         })
    //         .catch(err => console.log(err))
    //     }
    // }, [inputText])

    return (
        <div className="container">
            <div className="row">
                <div className="col-12 col-md-8 offset-md-2">
                    <Form>
                        <h3>Text Generation with LSTM</h3>
                        <p>Using the text of <a href="https://www.gutenberg.org/files/2554/2554-h/2554-h.htm" target="_blank" rel="noopener noreferrer">Crime and Punishment</a> a character generation 
                        LSTM model build using PyTorch was trained to predict the next character based on what has been typed in the input box.
                        </p>
                        <FormGroup>
                            <Label for="inputText" className="font-weight-bold">Input</Label>
                            <Input type="textarea" name="inputText" id="inputText" value= {inputText} 
                            onChange={handleInputTextChange} rows="5" placeholder="Type atleast 5 characters here..." />
                        </FormGroup>
                        <FormGroup>
                            <Label for="outputText" className="font-weight-bold">Model Output </Label>{showSpinner ? <TickerLoading msg={"Generating output..."}/>:null }
                            <Input type="textarea" name="outputText" id="outputText" disabled value={outputText} 
                            rows="10" placeholder="Model output here..."/>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        </div>
    )
};