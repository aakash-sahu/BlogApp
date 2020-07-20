import React, { useState, Fragment, useEffect } from 'react';
import { FormGroup, Label, Input, Form } from 'reactstrap';
import { baseUrl2 } from '../shared/baseUrl';
import { TickerLoading } from './LoadingComponent';
import { POSTS_FAILED } from '../redux/ActionTypes';

//creating this page using react hooks
export default function CharLSTM() {

    const [inputText, setInputText] = useState("");
    const [outputText, setoutputText] = useState("");

    function handleInputTextChange(event) {
        setInputText(event.target.value);
    };

    useEffect ( () => {
        const input = {prime: inputText, num_chars: 5*inputText.length + 20 };
        console.log(JSON.stringify(input));
        fetch(baseUrl2 + 'get_char_preds', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(input)
        })
        .then(response => response.json())
        .then(response => {
            setoutputText(response.pred)
        })
        .catch(err => console.log(err))
    }, [inputText])

    return (
        <div classname="container">
            <div className="row">
                <div className="col-12 col-md-8 offset-md-2">
                    <Form>
                        <h4>Char LSTM model</h4>
                        <p>The Char LSTM model was trained on "Crime and Punishment" and predicts the next character based on
                            what has been typed in the input box.
                        </p>
                        <FormGroup>
                            <Label for="inputText">Type here</Label>
                            <Input type="textarea" name="inputText" id="inputText" value= {inputText} 
                            onChange={handleInputTextChange} rows="5" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="outputText">Output shows here</Label>
                            <Input type="textarea" name="outputText" id="outputText" disabled value={outputText} rows="10"/>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        </div>
    )
};