import React, { Component, Fragment } from 'react';
import { Button, FormGroup, Label, Input, Form, Table, Col } from 'reactstrap';
// import { Redirect ,Link } from 'react-router-dom';
import { baseUrl2 } from '../shared/baseUrl';
import { Formik } from 'formik';
import Select from 'react-select';

function RenderTable({tickerData}) {
    const tickerRows = tickerData.map((data, key) => {
        return (
            // <div key={key}>
                <tr key ={key}>
                    <td>{data.date}</td>
                    <td>{data.open}</td>
                    <td>{data.close}</td>
                </tr>
            // </div>
        )
    });
    if (tickerData.length ===0) return <div />
    return (
        <div className="col-12 col-md-9 offset-md-2">
            <h3>{tickerData[1].ticker}</h3>
            <Table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Open</th>
                        <th>Close</th>
                    </tr>
                </thead>
                <tbody>
                    {tickerRows}
                </tbody>
            </Table>
        </div>
    )
}
class Models extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            message: null,
            tickers: [],
            selectedTicker: null,
            tickerData: []
        };
        this.handleSelectTicker = this.handleSelectTicker.bind(this);
    };

    componentDidMount() {
        // console.log("Postid in component mount: ", this.props.postId);
        this.loadTickers();
    };

    loadTickers = () => {
        fetch(baseUrl2 + 'get_tickers')
        .then(response => response.json())
        .then(response =>{
            console.log(response);
            this.setState({tickers:response.tickers})
        })
        .catch(err => console.log(err))
        
    };
    handleFileSubmit(values, actions) {
        console.log("File name: ", values.file.name)
        let data = new FormData()
        data.append('file', values.file)
        fetch(baseUrl2 + 'upload_ticker', {
            method: 'POST',
            body: data
        })
        .then(response => response.json())
        .then(response => console.log(response))
    }

    handleSelectTicker = (ticker) => {
        this.setState({selectedTicker: ticker});
        console.log("fetch ticker data: ",ticker.label)
        fetch(baseUrl2 + 'get_data/' + ticker.label)
        .then(response => response.json())
        .then(response => {
            // console.log(response.data);
            this.setState({tickerData: JSON.parse(response.data)})
        })
        .catch(err => console.log(err))
    }
    
    render() {
        console.log("ticker data: ",typeof(this.state.tickerData));
        const ticker_map = this.state.tickers.map((ticker) => ({label:ticker, value:ticker}))
        return (
            <div>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-9">
                        <h2>Ticker Charts</h2>
                        <Formik
                            initialValues ={{file:null}}
                            onSubmit={this.handleFileSubmit}
                        >
                            {(props) => { const { 
                            values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue } = props;
                            return (
                                <Form className="m-4" onSubmit={handleSubmit}>
                                    <legend>Load and charts the tickers</legend>
                                    <FormGroup row className="ml-2">
                                        <Label for="file" sm={3}>Upload ticker csv</Label>
                                        <Col sm={9}>
                                            <Input type="file" name="file" id="file"
                                            onChange = {(event => {setFieldValue("file", event.currentTarget.files[0])})} />
                                            {/* <FormText color="muted">Upload csv file</FormText> */}
                                        </Col>
                                    </FormGroup>
                                    <Button type="submit" value="submit" outline color="primary" disabled={isSubmitting}>Upload</Button>
                                </Form>
                            )}
                            }
                        </Formik>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-12 col-md-6 mt-4">
                        <h4>Select a ticker to plot </h4>
                        <Select options={ticker_map}
                        // value={this.state.selectedTicker}
                        onChange = {this.handleSelectTicker} />
                    </div>
                    <div>
                        <RenderTable tickerData={this.state.tickerData} />
                    </div>

                </div>
            </div>
            </div>
        );
    }
};


export default Models;