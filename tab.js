class Tabs extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
    componentDidMount() {
      const { activeTab } = this.props;
      
      this.moveSlider(activeTab, true)
    }
    componentWillReceiveProps(nextProps) {
      if (nextProps.activeTab !== this.props.activeTab) {
        this.moveSlider(nextProps.activeTab)
      }
    }
    componentWillUnmount() {
      if (this.transitionTimer) {
        clearTimeout(this.transitionTimer)
      }
    }
    moveSlider(index, init) {
      const { activeTab } = this.props;
  
      const tabs = this.refs.tabs;
      const currentTab = tabs.children[index];
      const tabsWidth = tabs.getBoundingClientRect().width;
      const currentTabWidth = currentTab.getBoundingClientRect().width
  
      const rightPercentage = ((currentTab.offsetLeft - 15) + currentTabWidth) * 100 / tabsWidth + '%';
      const leftPercentage = (currentTab.offsetLeft + 15) * 100 / tabsWidth + '%';
  
      const sideProperty = (withTimer) => {
        if (!withTimer) return index > activeTab ? '--right-side' : '--left-side';
        
        return index > activeTab ? '--left-side' : '--right-side';
      }
  
      const sidePercentage = (withTimer) => {
        if (!withTimer) return index > activeTab ? rightPercentage : leftPercentage;
        
        return index > activeTab ? leftPercentage : rightPercentage;
      }
  
      tabs.style.setProperty(sideProperty(), sidePercentage());
          
          if (init) {
              tabs.style.setProperty(sideProperty(true), sidePercentage(true));
              
              return;
          }
  
      if (this.transitionTimer) {
        clearTimeout(this.transitionTimer)
      }
      
      this.transitionTimer = setTimeout(() => {
        tabs.style.setProperty(sideProperty(true), sidePercentage(true));
        this.transitionTimer = undefined;
      }, 350)
    }
    renderTabs() {
      const { activeTab, tabs, onTabChange } = this.props;
  
      return tabs.map((t, i) => {
        let className = 'tab';
  
        if (i === activeTab) {
          className += ' tab--active'
        }
        
        return (
          <div className={className} key={i} data-index={i} onClick={onTabChange}>
            {t}
          </div>
        )
      })
    }
    render() {
      return (
        <div className="tabs" ref="tabs">
          {this.renderTabs()}
  
          <div className="line" ref="line" />
        </div>
      );
    }
  }
  
  class Application extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
              activeTabIndex: 0
      };
          
          this.onTabChange = this.onTabChange.bind(this);
    }
      onTabChange(e) {
          const { activeTabIndex } = this.state;
          const index = parseInt(e.target.getAttribute('data-index'));
          
          if (activeTabIndex !== index) {
              this.setState({ activeTabIndex: index })
          }
      }
    render() {
          const { activeTabIndex } = this.state;
          const tabs = ['Current Quarter', 'Next Quarter', 'Further Out', 'All'];
          
      return <Tabs tabs={tabs} activeTab={activeTabIndex} onTabChange={this.onTabChange} />
    }
  }
  
  ReactDOM.render(<Application />, document.getElementById('app'));