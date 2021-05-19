import React from 'react';

import './Platform.css'
class Platform extends React.Component {

    state = {
        platformId: 0,

    }

    componentDidMount() {
        this.setState({platformId: this.props.idKey})
    }
    render() {

        return(
            <div className="platform" id={this.state.platformId} style={{margin: `96px 0 56px ${this.props.xAxis}%`, width: "60px", height: "10px", backgroundColor: `${this.props.color}`}}>
                {/* {`p${this.state.platformId}`} */}
            </div>
        )
    }
    
}

export default Platform;