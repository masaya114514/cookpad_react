import React, { Component } from 'react';
// eslint-disable-next-line
import { AppBar, Drawer, List, ListItem, Table, TableBody, TableRow, TableHeader, TableHeaderColumn, TableRowColumn, IconButton, TextField } from 'material-ui';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class SideBar extends Component {
    componentWillMount() {
        this.setState({ drawerOpen: false });
    }
    handleOpen = () => { this.setState({ drawerOpen: true }); };
    handleClose = () => { this.setState({ drawerOpen: false }); };

    render() {
        return (
            <div>
                <Drawer
                    docked={false}
                    open={this.state.drawerOpen}
                    containerStyle={{ top: 64 }}
                    onRequestChange={this.handleClose}
                >
                    <List>
                        <ListItem
                            primaryText='保存済みのレシピ'
                            nestedItems={
                                [<ListItem
                                    key='0'
                                    primaryText="Contact"
                                    containerElement={<Link to="/contact" />}
                                    onClick={this.handleClose}
                                />,
                                <ListItem
                                    key='1'
                                    primaryText="About"
                                    containerElement={<Link to="/about" />}
                                    onClick={this.handleClose}
                                />
                                ]
                            }
                        />
                        <ListItem
                            primaryText='Item 2'
                            nestedItems={
                                [<ListItem
                                    key='0'
                                    primaryText="Home"
                                    containerElement={<Link to="/" />}
                                    onClick={this.handleClose}
                                />,
                                <ListItem
                                    key='1'
                                    primaryText="topics"
                                    containerElement={<Link to="/topics" />}
                                    onClick={this.handleClose}
                                />
                                ]
                            }
                        />
                    </List>
                </Drawer>

                <AppBar
                    title="CookPad Count"
                    onLeftIconButtonClick={this.handleOpen}
                />
            </div>);
    }
}

class IdField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "5262004",
        };
    }
    render() {
        return (
            <div>
                <TextField
                    id="outlined-adornment-weight"
                    variant="outlined"
                    label="Weight"
                    onChange={(e) => this.setState({ text: e.target.value })}
                />
                <Recipe data={this.state.text}></Recipe>
                {/*<Weight></Weight>*/}
            </div>
        );
    }
}

class Recipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            ingredients: [],
            time: 2,
            as_num_of_people: 1,
        };
    }
    search_recipe() {
        axios.get('http://127.0.0.1:5042/recipe_api/' + this.props.data)
            .then(response => {
                //console.log(response.data.ingredients[0][1].number_position);
                this.setState({
                    title: response.data.title,
                    ingredients: response.data.ingredients,
                });
            }).catch(err => {
                console.log('err:', err);
            });
    }

    render() {
        return (
            <div>
                <IconButton onClick={() => this.search_recipe()}>
                    <SearchIcon fontSize="large" />
                </IconButton>
                <h1>{this.state.title}</h1>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>材料</TableHeaderColumn>
                            <TableHeaderColumn>量</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    {/*
                    <TableBody>
                        {this.state.ingredients.map((i, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableRowColumn>{i.org_text}</TableRowColumn>
                                    <TableRowColumn dangerouslySetInnerHTML={{ __html: i[1] }}></TableRowColumn>
                                    <TableRowColumn>{i.number_position}</TableRowColumn>
                                </TableRow>
                            );
                        
                    </TableBody>
                    */}
                    <TableBody>
                        {this.state.ingredients.map((i, index) => {
                            if (i[1].number_position[1]==null) {
                                return (
                                    <TableRow key={index}>
                                        <TableRowColumn>{i[0]}</TableRowColumn>
                                        <TableRowColumn>{i[1].org_text}</TableRowColumn>
                                        <TableRowColumn>{i[1].org_text}</TableRowColumn>
                                    </TableRow>
                                );
                            }
                            else {
                                return (
                                    <TableRow key={index}>
                                        <TableRowColumn>{i[0]}</TableRowColumn>
                                        <TableRowColumn>{i[1].org_text}</TableRowColumn>
                                        <TableRowColumn>
                                            {
                                                i[1].org_text.slice(0, i[1].number_position[0]) +
                                                i[1].org_text.substring(i[1].number_position[0], i[1].number_position[1])
                                                / this.state.as_num_of_people * this.state.time +
                                                i[1].org_text.slice(i[1].number_position[1])
                                            }
                                        </TableRowColumn>
                                    </TableRow>
                                );
                            }
                        })}
                    </TableBody>
                </Table>
                <div>
                    元のレシピを
                            <IconButton onClick={() => this.setState({ as_num_of_people: this.state.as_num_of_people + 1 })}>
                            <AddIcon fontSize="large" />
                        </IconButton>
                        {this.state.as_num_of_people}
                        <IconButton disabled={this.state.as_num_of_people === 1} onClick={() => this.setState({ as_num_of_people: this.state.as_num_of_people - 1 })}>
                            <RemoveIcon fontSize="large" />
                        </IconButton>
                        人前として、
                        <IconButton onClick={() => this.setState({ time: this.state.time + 1 })}>
                            <AddIcon fontSize="large" />
                        </IconButton>
                        {this.state.time}
                        <IconButton disabled={this.state.time === 1} onClick={() => this.setState({ time: this.state.time - 1 })} >
                            <RemoveIcon fontSize="large" />
                        </IconButton>
                        人分表示する
                </div>

            </div>
        );
    }
}

/*
class Weight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 2,
            as_num_of_people: 1,
        };
    }
    render() {
        return (
            <div>
                <div>元のレシピを{this.state.as_num_of_people}人前として、{this.state.time}人分表示する</div>
                <IconButton>
                    <AddIcon fontSize="large" onClick={() => this.setState({ time: this.state.time + 1 })} />
                </IconButton>
                <IconButton>
                    <RemoveIcon fontSize="large" onClick={() => this.setState({ time: this.state.time - 1 })} />
                </IconButton>
                <IconButton>
                    <AddIcon fontSize="large" onClick={() => this.setState({ as_num_of_people: this.state.as_num_of_people + 1 })} />
                </IconButton>
                <IconButton>
                    <RemoveIcon fontSize="large" onClick={() => this.setState({ as_num_of_people: this.state.as_num_of_people - 1 })} />
                </IconButton>
            </div>
        );
    }
}
*/

export default class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <SideBar />
                    <Route exact path="/" component={IdField} />
                </div>
            </Router>
        );
    }
}