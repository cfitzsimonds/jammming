import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';
let trackArray;


class TrackList extends React.Component {
  render() {
    return (
      	<div className="TrackList">
        	{
        		this.props.tracks.map(track => {
        			return <Track key={track.id} name={track.name} album={track.album} artist={track.artist} onAdd={this.props.onAdd} onRemove={this.props.onRemove} />
        		})
        	}
      	</div>
    );
  }
}

export default TrackList;