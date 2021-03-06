import React from 'react';
import Tab from './tab';
import Content from './content';
import style from './style';

class Tabs extends React.Component {
  static propTypes = {
    index: React.PropTypes.number,
    className: React.PropTypes.string,
    onChange: React.PropTypes.func
  };

  static defaultProps = {
    index: 0
  };

  state = {
    pointer: {}
  };

  componentWillReceiveProps (nextProps) {
    this.updatePointer(nextProps.index);
  }

  componentDidMount () {
    setTimeout(() => {
      this.updatePointer(this.props.index);
    }, 100);
  }

  handleHeaderClick = (idx) => {
    if (this.props.onChange) this.props.onChange(idx);
  };

  parseChildren () {
    const headers = [];
    const contents = [];

    React.Children.forEach(this.props.children, (item) => {
      if (item.type === Tab) {
        headers.push(item);
        if (item.props.children) {
          contents.push(<Content children={item.props.children}/>);
        }
      } else if (item.type === Content) {
        contents.push(item);
      }
    });

    return {headers, contents};
  }

  updatePointer (idx) {
    const startPoint = this.refs.tabs.getBoundingClientRect().left;
    const label = this.refs.navigation.children[idx].getBoundingClientRect();
    this.setState({
      pointer: {
        top: `${this.refs.navigation.getBoundingClientRect().height}px`,
        left: `${label.left - startPoint}px`,
        width: `${label.width}px`
      }
    });
  }

  renderHeaders (headers) {
    return headers.map((item, idx) => {
      return React.cloneElement(item, {
        key: idx,
        active: this.props.index === idx,
        onClick: this.handleHeaderClick.bind(this, idx, item)
      });
    });
  }

  renderContents (contents) {
    return contents.map((item, idx) => {
      return React.cloneElement(item, {
        key: idx,
        active: this.props.index === idx,
        tabIndex: idx
      });
    });
  }

  render () {
    let className = style.root;
    const { headers, contents } = this.parseChildren();
    if (this.props.className) className += ` ${this.props.className}`;

    return (
      <div ref='tabs' className={className}>
        <nav className={style.navigation} ref='navigation'>
          {this.renderHeaders(headers)}
        </nav>
        <span className={style.pointer} style={this.state.pointer} />
        {this.renderContents(contents)}
      </div>
    );
  }
}

export default Tabs;
