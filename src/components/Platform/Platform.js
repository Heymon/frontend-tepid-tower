import React from 'react';

class Platform extends React.Component {

    state = {
        platformId: 0,

    }

    componentDidMount() {
        this.setState({platformId: this.props.idKey})
    }
    render() {

        return(
            <div className="platform" style={{margin: `96px 0 56px ${this.props.yAxis}%`, width: "60px", height: "10px", backgroundColor: `${this.props.color}`}}>
                {this.state.platformId}
            </div>
        )
    }
    
}

export default Platform;