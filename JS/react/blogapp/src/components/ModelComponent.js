import React, { Component, Fragment } from 'react';
import { Button, FormGroup, Label, Input, Form, Table, Col, TabContent, TabPane, Nav, 
    NavItem, NavLink, Card, CardBody, UncontrolledCollapse, CardHeader, FormText } from 'reactstrap';
// import { Redirect ,Link } from 'react-router-dom';
import { baseUrl2 } from '../shared/baseUrl';
import { Formik } from 'formik';
import Select from 'react-select';
import { Line, Bar  } from 'react-chartjs-2';
import { TickerLoading } from './LoadingComponent';

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
            chartData: {},
            isTickerLoading: false,
            isAllTickersLoading:false
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
        this.setState({isAllTickersLoading: true});
        fetch(baseUrl2 + 'get_tickers')
        .then(response => response.json())
        .then(response =>{
            console.log(response);
            this.setState({tickers:response.tickers, isAllTickersLoading: false});
        })
        .catch(err => console.log(err))
        
    };
    handleFileSubmit(values, {resetForm}) {
        // console.log("File name: ", values.file.name)
        this.setState({isAllTickersLoading: true});
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
            this.setState({selectedTicker:null, tickerData:[], isAllTickersLoading: false});
            // alert('File saved');
        })
    }

    handleSelectTicker = (ticker) => {
        this.setState({selectedTicker: ticker});
        if (ticker) {
            this.setState({isTickerLoading: true});
            console.log("fetch ticker data: ",ticker.label)
            fetch(baseUrl2 + 'get_data/' + ticker.label)
            .then(response => response.json())
            .then(response => {
                // console.log(response.data);
                this.setState({tickerData: JSON.parse(response.data), isTickerLoading:false});
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
        let volume = response.map((row) => row.volume/100000);
        let datasets = [
                            {type:'line', label:'close',  data:closePrice,  fill: false,
                            borderColor: '#EC932F',
                            backgroundColor: '#EC932F',
                            pointBorderColor: '#EC932F',
                            pointBackgroundColor: '#EC932F',
                            pointHoverBackgroundColor: '#71B37C',
                            pointHoverBorderColor: '#71B37C',
                            yAxisID: 'y-axis-2', pointRadius: 0, pointHitRadius:5 },

                            {type:'bar', label:'volume (100k)',  data:volume,  yAxisID: 'y-axis-1',       fill: false,
                            backgroundColor: '#71B37C',
                            borderColor: '#71B37C',
                            hoverBackgroundColor: '#71B37C',
                            hoverBorderColor: '#71B37C',
                            yAxisID: 'y-axis-1'},
                            
                            // {type:'line', label:'close',  data:[60,60,60,60,61,62],  fill: false,
                            // borderColor: '#777',
                            // backgroundColor: '#EC932F',
                            // pointBorderColor: '#EC932F',
                            // pointBackgroundColor: '#EC932F',
                            // pointHoverBackgroundColor: '#71B37C',
                            // pointHoverBorderColor: '#71B37C',
                            // yAxisID: 'y-axis-2', pointRadius: 0, pointHitRadius:5 },
                        ]
        // console.log(labels);
        this.setState({
            chartData: {...this.state.chartData, labels, datasets}
        })
    };
    
    render() {
        const options = {
            responsive: true,
            // labels:labels,
            tooltips: {
              mode: 'label'
            },
            elements: {
              line: {
                fill: false
              }
            },
            scales: {
              xAxes: [
                {
                  display: true,
                  gridLines: {
                    display: false
                  },
                  labels: this.state.chartData.labels,
                  scaleLabel :{
                      display:true,
                      labelString: 'Date'
                  }
                }
              ],
              yAxes: [
                {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  id: 'y-axis-1',
                  gridLines: {
                    display: false
                  },
                  labels: {
                    show: true
                  },
                  scaleLabel :{
                      display:true,
                      labelString: 'Volume'
                  }
                },
                {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  id: 'y-axis-2',
                  gridLines: {
                    display: false
                  },
                  labels: {
                    show: true
                  },
                  scaleLabel :{
                      display:true,
                      labelString: 'Price'
                  }
                }
              ]
            }
          };
        // console.log("ticker data: ",typeof(this.state.tickerData));
        const ticker_map = this.state.tickers.map((ticker) => ({label:ticker, value:ticker}))
        return (
            <div>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-9">
                        <Card>
                            <CardHeader id="toggleUpload"><h5>Load the ticker data  <i className="fa fa-hand-o-down"></i></h5></CardHeader>
                            <UncontrolledCollapse toggler='#toggleUpload'>
                                <CardBody>
                                    <Formik
                                    initialValues ={{file:null}}
                                    onSubmit={this.handleFileSubmit} 
                                    >
                                    {(props) => { 
                                        const { handleSubmit, isSubmitting, setFieldValue } = props;
                                    return (
                                        <Form className="m-1" onSubmit={handleSubmit}>
                                            {/* <legend>Load and charts the tickers</legend> */}
                                            <FormGroup row className="ml-2">
                                                <Label for="file" sm={3}>Upload ticker csv</Label>
                                                <Col sm={6}>
                                                    <Input type="file" name="file" id="file"
                                                    onChange = {(event => {setFieldValue("file", event.currentTarget.files[0])})} />
                                                    <FormText color="muted">Upload csv file for ticker from yahoo finance</FormText>
                                                </Col>
                                            </FormGroup>
                                            <div className="ml-3">
                                                <Button type="submit" value="submit" outline color="primary" disabled={isSubmitting}>Upload</Button>
                                            </div>
                                        </Form>
                                    )}
                                    }
                                    </Formik>
                                </CardBody>
                            </UncontrolledCollapse>
                        </Card>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-12 col-md-6 mt-4">
                        <h4>Select a ticker {this.state.isAllTickersLoading? <TickerLoading/>:null } </h4>
                        <Select options={ticker_map}
                        value={this.state.selectedTicker}
                        onChange = {this.handleSelectTicker}
                        isClearable={true}
                        placeholder="Search ticker..." />
                    </div>
                </div>
                <div className= "row mt-4">
                    <div className="col-12 col-md-10 offset-md-1 mt-4">
                        <h5 className="text-center text-muted mb-2">
                            {this.state.selectedTicker? this.state.selectedTicker.label: "Select a ticker to see charts and data"}
                            {this.state.isTickerLoading? <TickerLoading/>:null }
                        </h5>
                        {/* Removing the loading component from here as the chart transition is not smooth */}
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
                                    <div className="col-12 mt-2">
                                        {this.state.selectedTicker? 
                                        <Bar data={this.state.chartData} options={options}/>
                                        : 
                                        null} 
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