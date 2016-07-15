var fakeData =  [
  {
    "Sell CCY": 0,
    "Sell Amount": "",
    "Buy CCY": "",
    "Buy Amount": "",
    "Rate": "",
    "Date Booked": ""
  }
];

var Currencies = React.createClass({
    getInitialState() {
        var items;
        return {
            items: {
                "rates": {}
            },
            selected: ''
        };
    },
    componentWillReceiveProps: function (nextProps){
        var newState = { items: nextProps.options }
        if ( nextProps.reset ){
            newState.selected = nextProps.options["base"]
            this.props.onChange(nextProps.options["base"], 1);
        }
        this.setState(newState);
    },
    handleChange: function ( e ) {
        this.setState({ selected: e.target.value });
        this.props.onChange(e.target.value, this.state.items["rates"][e.target.value]);
    },
    render: function () {
        var self = this;
        var options = Object.keys(self.state.items["rates"]).map(function ( item ){
            return <option value={ item }>{ item }</option>;
        });
        options.unshift(<option value={ this.state.items["base"] } >{ this.state.items["base"] }</option>)
        return <select className="form-control" value={ this.state.selected } onChange={ this.handleChange }>{ options }</select>;
    }
});

var NewTradeForm = React.createClass({
    getInitialState() {
        return {
            items: {},
            rate: 1,
            base: "EUR",
            buy_currency: "EUR",
            sell_amount: 0,
            buy_amount: 0,
            reset: false
        };
    },
    getData: function ( base ) {
        var self = this,
            url = "http://api.fixer.io/latest" + "?base=" + base
        self.serverRequest = fetch( url )
            .then(response => response.json())
            .then(data => this.setState({
                base: base,
                items: data,
                reset: true
            }));
    },
    handleChangeBase: function ( base, rate ) {
        this.getData(base);
    },
    handleChangeRate: function ( base, rate ) {
        this.setState({
            buy_currency: base,
            rate: rate,
            buy_amount: this.state.sell_amount * rate,
            reset: false
        })
    },
    componentDidMount: function() {
        this.getData(this.state.base);
    },
    componentWillUnmount: function() {
        // this.serverRequest.abort();
    },
    onChangeSellValue: function ( e ) {
        var self = this;
        this.setState({
            sell_amount: e.target.value,
            buy_amount: e.target.value * self.state.rate,
        })
    },
    handleCreate: function () {
        var self = this,
            data = {
                "sell_currency": self.state.base,
                "sell_amount": self.state.sell_amount,
                "buy_currency": self.state.buy_currency,
                "buy_amount": self.state.buy_amount,
                "rate": self.state.rate
            },
            request = new XMLHttpRequest();
        console.log(data);
        request.open("POST", 'api/exchange');
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(data));
    },
    handleCancel: function () {
        console.log("CANCEL");
    },
    render: function () {
        return <div className="container">
            <div className="row">
                <div className="col-md-4">
                    <Currencies options={ this.state.items } onChange={ this.handleChangeBase } />
                </div>
                <div className="col-md-4">
                    <input className="form-control"  type="number" id="rate" value={ this.state.rate } disabled></input>
                </div>
                <div className="col-md-4">
                    <Currencies options={ this.state.items } onChange={ this.handleChangeRate } reset={ this.state.reset }/>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <input className="form-control" type="number" id="sell_amount" onChange={ this.onChangeSellValue } ></input>
                </div>
                <div className="col-md-4">
                </div>
                <div className="col-md-4">
                    <input className="form-control" type="number" id="buy_amount" disabled value={ this.state.sell_amount * this.state.rate }></input>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div className="create-entry-button">
                        <button type="button" className="btn btn-default form-control" onClick={ this.handleCreate }>
                            <i className="fa fa-plus-circle" aria-hidden="true"></i>
                            <span>Create</span>
                        </button>

                    </div>
                </div>
                <div className="col-md-4">
                </div>
                <div className="col-md-4">
                    <div className="create-entry-button">
                        <button type="button" className="btn btn-default form-control" onClick={ this.handleCancel }>
                            <i className="fa fa-times-circle" aria-hidden="true"></i>
                            <span>Cancel</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>;
    }
});

var MyGrid = React.createClass({
    getInitialState() {
        return {
            data: []
        };
    },
    getData: function () {
        var self = this,
            url = "api/exchange"
        self.serverRequest = fetch( url )
            .then(response => response.json())
            .then(data => this.setState({data: data}));
    },
    componentDidMount: function() {
        this.getData();
    },
    render: function () {
        return <Griddle results={ this.state.data } />
    }
});

var Container = React.createClass({
    getInitialState() {
        return {
            active: "Grid"
        };
    },
    handleClick: function ( e ) {
        this.setState({ active: e.target.textContent });
    },
    render: function () {
        var elem, menu;
        if ( this.state.active === "Grid" ) {
            elem =  <MyGrid />
            menu = <div className="row">
                <div className="col-md-6 can-select-selected" onClick={ this.handleClick }>Grid</div>
                <div className="col-md-6 can-select" onClick={ this.handleClick }>New</div>
            </div>;
        } else {
            elem = <NewTradeForm />;
            menu = <div className="row">
                <div className="col-md-6 can-select" onClick={ this.handleClick }>Grid</div>
                <div className="col-md-6 can-select-selected" onClick={ this.handleClick }>New</div>
            </div>;
        }
        return <div className="container">
            { menu }
            <div className="row">
                <div className="container">
                    <div className="row">
                        { elem }
                    </div>
                </div>
            </div>
        </div>;
    }
});

ReactDOM.render(<Container />, document.getElementById("container"));