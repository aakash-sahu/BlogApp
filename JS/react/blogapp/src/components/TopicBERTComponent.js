import React, { useState } from 'react';
import { FormGroup, Label, Input, Form, Button, ButtonGroup, Table, CustomInput } from 'reactstrap';
import { baseUrl2 } from '../shared/baseUrl';
import { TickerLoading } from './LoadingComponent';
import { Formik } from 'formik';

function RenderOutput({output, predType}) {

    if (predType==='' | output.length ===0) {
        return (
            <div></div>
        )
    }
    else if (predType === "prod" & output.length >0) {
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
            <Button type="submit" value="submit" color="secondary" className="" onClick={() => alert("Your feedback has been submitted!!")}>Submit Feedback</Button>
            </>
        )
    }
    else if (predType === "validation" & output.length >0) {
        output = JSON.parse(output);
        console.log(output, typeof(output));
        const renderValidationOutput = output.map((data, key) => {
            return (
                <tr key ={key}>
                <td>{data.SentenceNum}</td>
                <td>{data.Sentence}</td>
                <td>{data.KeyphraseAndTag}</td>
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

    //if I put both predtype and output in the same state component, won't have to set the state to null in the handleFormSubmit function
    // I think since state changes at different times, the RenderOutput function is giving error.. or could put more proper conditions in the render function..
    const [predType, setPredType] =useState("");
    const [output, setOutput] = useState([]);
    const [showSpinner, setSpinner] = useState(false);

    function handleFormSubmit(values, actions) {
        // console.log(JSON.stringify(values));
        const input = {pred_type: values.predOptions, text:values.inputText};
        setOutput('');
        setPredType('');
        console.log(input);
        setSpinner(true);
        fetch(baseUrl2 + 'topic_bert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(input)
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            setSpinner(false);
            setOutput(response.pred);
            setPredType(values.predOptions);
            return response;
        })
        .then((output) => {

            actions.setSubmitting(false);
        })
        .catch(err => console.log(err))
        
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-12 col-md-8 offset-md-2">
                    <h3>Keyphrase Extraction Using Fine-tuned BERT</h3>
                    <p>BERT base pre-trained model fine tuned on SemEval 2010 data for topic extraction from research papers.</p>
                    <Formik
                        initialValues={{inputText:'', predOptions:'' }}
                        onSubmit={handleFormSubmit}>
                            {
                                (props) => {
                                    const {values, handleSubmit, isSubmitting, handleChange, setFieldValue} = props;
                                    return (
                                        <Form onSubmit={handleSubmit}>
                                            <FormGroup>
                                                <Label for="inputText" className="font-weight-bold">Input</Label>
                                                <Input type="textarea" name="inputText" id="inputText" value= {values.inputText} 
                                                onChange={handleChange} rows="10" placeholder="Input text for topic extraction here..." />
                                            </FormGroup>
                                            <FormGroup>
                                                <h5>Prediction Type</h5>
                                                {/* <ButtonGroup>
                                                    <Button color="primary" onClick={() => handleRadioButtons("prod")} active={predType==="prod"}>Prod</Button>
                                                    <Button color="primary" onClick={() => handleRadioButtons("validation")} active={predType==="validation"}>Validation</Button>
                                                </ButtonGroup> */}
                                                <ButtonGroup>
                                                    <Label check className="btn">
                                                        <Input type="radio" name="predOptions" value="prod" checked={values.predOptions === 'prod'} onChange={() => setFieldValue("predOptions", "prod")} /> Prod
                                                    </Label>
                                                    <Label check className="btn">
                                                        <Input type="radio" name="predOptions" value="validation" checked={values.predOptions === 'validation'} onChange={() => setFieldValue("predOptions", "validation")}/> Validation
                                                    </Label>                             
                                                </ButtonGroup>                            
                                            </FormGroup>
                                            <Button type="submit" value="submit" outline color="primary" disabled={isSubmitting}>Submit</Button>
                                            {showSpinner ? <TickerLoading msg={"Getting key phrases..."}/>:null }
                                        </Form>
                                    )
                                }
                            }
                        </Formik>
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