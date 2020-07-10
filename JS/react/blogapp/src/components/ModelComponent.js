import React, { Component, Fragment } from 'react';
import { Button, FormGroup, Label, Input, Form, Table, Col, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
// import { Redirect ,Link } from 'react-router-dom';
import { baseUrl2 } from '../shared/baseUrl';
import { Formik } from 'formik';
import Select from 'react-select';
import { Line  } from 'react-chartjs-2';

function RenderTable({tickerData}) {
    const tickerRows = tickerData.map((data, key) => {
        return (
            <tr key ={key}>
                <td>{data.date}</td>
                <td>{data.open}</td>
                <td>{data.close}</td>
                <td>{data.volume}</td>
            </tr>
        )
    });
    if (tickerData.length ===0) return <div />
    return (
        <Fragment>
            <div style={{ height: '500px', overflow:'scroll'}}>
                <Table hover >
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Open</th>
                            <th>Close</th>
                            <th>Volume</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickerRows}
                    </tbody>
                </Table>
            </div>

        </Fragment>
    );
}
class Models extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            message: null,
            tickerUploaded: null,
            tickers: [],
            selectedTicker: null,
            tickerData: [],
            activeTab: 'charts',
            chartData: {}
        };
        this.handleSelectTicker = this.handleSelectTicker.bind(this);
        this.loadTickers = this.loadTickers.bind(this);
        this.handleFileSubmit = this.handleFileSubmit.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
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
    handleFileSubmit(values, {resetForm}) {
        console.log("File name: ", values.file.name)
        let data = new FormData()
        data.append('file', values.file)
        fetch(baseUrl2 + 'upload_ticker', {
            method: 'POST',
            body: data
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            this.setState({tickerUploaded:response.ticker});
            this.loadTickers();
            resetForm();
            this.setState({selectedTicker:null, tickerData:[]});
            alert('File saved');
        })
    }

    handleSelectTicker = (ticker) => {
        this.setState({selectedTicker: ticker});
        if (ticker) {
            console.log("fetch ticker data: ",ticker.label)
            fetch(baseUrl2 + 'get_data/' + ticker.label)
            .then(response => response.json())
            .then(response => {
                // console.log(response.data);
                this.setState({tickerData: JSON.parse(response.data)});
                this.loadChartData(JSON.parse(response.data));
            })
            .catch(err => console.log(err))
        }
        else {
            this.setState({tickerData: []});
        }
    };
    
    toggleTab = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({activeTab: tab})
        }
    };

    loadChartData = (response) => {
        response.reverse();
        let labels = response.map((row) => row.date);
        let closePrice = response.map((row) => row.close);
        let volume = response.map((row) => row.volume);
        let datasets = [
                            {label:'close', fill:false, data:closePrice, lineTension: 0.1, backgroundColor: 'rgba(75,192,192,0.4)',
                            borderColor: 'rgba(75,192,192,1)', borderCapStyle: 'butt',borderDash: [],
                            borderDashOffset: 0.0, borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(75,192,192,1)', pointBackgroundColor: '#fff',
                            pointBorderWidth: 1, pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(75,192,192,1)', pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,pointRadius: 1,pointHitRadius: 10}
                        ]
        // console.log(labels);
        this.setState({
            chartData: {...this.state.chartData, labels, datasets}
        })
    };
    
    render() {
        // console.log("ticker data: ",typeof(this.state.tickerData));
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
                            {(props) => { 
                                const { handleSubmit, isSubmitting, setFieldValue } = props;
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
                        value={this.state.selectedTicker}
                        onChange = {this.handleSelectTicker}
                        isClearable={true}
                        placeholder="Search ticker..." />
                    </div>
                </div>
                <div className= "row mt-4">
                    <div className="col-12 col-md-10 offset-md-1 mt-4">
                        <h5 className="text-center text-muted mb-2">{this.state.selectedTicker? this.state.selectedTicker.label: "Select a ticker to see charts and data"}</h5>
                        <Nav tabs>
                            <NavItem>
                                <NavLink className={this.state.activeTab === 'charts'? 'active': ''}
                                    onClick= {()=>{this.toggleTab('charts')}}>
                                    Charts
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={this.state.activeTab === 'data'? 'active': ''}
                                    onClick= {()=>{this.toggleTab('data')}}>
                                    Data
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="charts">
                                <div className="row">
                                    <div className="col-10 offset-md-1 mt-2">
                                        {this.state.selectedTicker? <Line data={this.state.chartData}/>: null} 
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tabId="data">
                                <div className="row">
                                    <div className="col-10 offset-md-1 mt-2">
                                        <RenderTable tickerData={this.state.tickerData} />
                                    </div>
                                </div>
                            </TabPane>
                        </TabContent>
                        
                    </div>
                </div>


            </div>
            </div>
        );
    }
};


export default Models;