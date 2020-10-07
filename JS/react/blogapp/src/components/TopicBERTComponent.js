import React, { useState } from 'react';
import { FormGroup, Label, Input, Form, Button, ButtonGroup, Table, CustomInput } from 'reactstrap';
import { baseUrl2 } from '../shared/baseUrl';
import { TickerLoading } from './LoadingComponent';
import { Formik } from 'formik';

function RenderOutput({output, predType}) {
    if (predType === "prod") {
        const renderProdOutput = output.map((data, key) => {
            return (
                // <li key={key}>{data}</li>
                <CustomInput type="switch" id={data} name="keywordSwitch" label={data} defaultChecked key={key}/>
            )
        })
        return (
            <>
            <h4>Key Phrases for the text</h4>
            <FormGroup>
                <h6>Uncheck the key phrases which are not valid.</h6>
                {renderProdOutput}
            </FormGroup>
            <FormGroup>
                <Label for="inputTopics">(Optional) Add additional topics here separated by comma</Label>
                <Input placeholder={'Placeholder for user to optionally add additional topics for the input'}/>
            </FormGroup>
            <Button type="submit" value="submit" color="secondary" className="">Submit Feedback</Button>
            </>
        )
    }
    if (predType === "validation") {
        output = JSON.parse(output);
        console.log(output, typeof(output));
        const renderValidationOutput = output.map((data, key) => {
            return (
                <tr key ={key}>
                <td>{data.SentenceNum}</td>
                <td>{data.Sentence}</td>
                <td>{JSON.stringify(data.KeyphraseAndTag)}</td>
            </tr>
            )
        })
        return (
            <>
            <ul>
            <Table hover >
                    <thead>
                        <tr>
                            <th>Sentence Number</th>
                            <th>Sentence</th>
                            <th>Keyphrase and Tag</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderValidationOutput}
                    </tbody>
                </Table>
            </ul>
            </>
        )
    }
};

//creating this page using react hooks
export default function KeyphraseExtract() {

    const [inputText, setInputText] = useState("");
    const [predType, setPredType] =useState("prod");
    const [output, setOutput] = useState([]);
    const [showSpinner, setSpinner] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        console.log(event.values);
        const input = {pred_type: predType, text:inputText };
        setSpinner(true);
        console.log(input)
        fetch(baseUrl2 + 'topic_bert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(input)
        })
        .then(response => response.json())
        .then(response => {
            setSpinner(false);
            setOutput(response.pred)
            return response;
        })
        .then((output) => console.log(output))
        .catch(err => console.log(err))
        
    };

    function handleRadioButtons(predValue) {
        if (output.length >0 ) {
            setPredType(predValue);
            handleSubmit(new Event('placeholder'));
        }
        else if (output.length ===0 ){
            setPredType(predValue);
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-12 col-md-8 offset-md-2">
                    <Form onSubmit={handleSubmit}>
                        <h3>Keyphrase Extraction Using Fine-tuned BERT</h3>
                        <p>BERT base pre-trained model fine tuned on SemEval 2010 data for topic extraction from research papers.</p>
                        <FormGroup>
                            <Label for="inputText" className="font-weight-bold">Input</Label>
                            <Input type="textarea" name="inputText" id="inputText" value= {inputText} 
                            onChange={(event) => setInputText(event.target.value)} rows="10" placeholder="Input text for topic extraction here..." />
                        </FormGroup>
                        <FormGroup>
                            <h5>Prediction Type</h5>
                            <ButtonGroup>
                                <Button color="primary" onClick={() => handleRadioButtons("prod")} active={predType==="prod"}>Prod</Button>
                                <Button color="primary" onClick={() => handleRadioButtons("validation")} active={predType==="validation"}>Validation</Button>
                            </ButtonGroup>
                            {/* <ButtonGroup>
                                <Label className="btn">
                                    <Input type="radio" name="options" checked /> Prod
                                </Label>
                                <Label className="btn">
                                    <Input type="radio" name="options" /> Validation
                                </Label>                             
                            </ButtonGroup>                             */}
                        </FormGroup>
                        <Button type="submit" value="submit" outline color="primary" className="">Submit</Button>
                        {showSpinner ? <TickerLoading msg={"Getting key phrases..."}/>:null }
                    </Form>
                </div>
            </div>
            <div className="row mb-5">
                {output.length > 0?
                <div className="col-12 col-md-8 offset-md-2 mt-4"> 
                    <RenderOutput output={output} predType={predType}/>
                </div>
                : <div></div>
                }
            </div>
        </div>
    )
};