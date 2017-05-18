import React, { Component } from 'react';
import { connect } from 'react-redux';
import FollowingUserIllusts from './FollowingUserIllusts';
import NewIllusts from './NewIllusts';
import NewMangas from './NewMangas';
import MyPixiv from './MyPixiv';
import { connectLocalization } from '../../components/Localization';
import PXTabView from '../../components/PXTabView';

class NewWorks extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      tabBarLabel: params && params.i18n.newest,
    };
  };

  constructor(props) {
    super(props);
    const { user } = props;
    let routes = [
      { key: '1', title: 'Following' },
      { key: '2', title: 'Illust' },
      { key: '3', title: 'Manga' },
    ];
    if (user) {
      routes = [...routes, { key: '4', title: 'My Pixiv' }];
    }

    this.state = {
      index: 0,
      routes,
    };
  }

  componentDidMount() {
    const { i18n, navigation: { setParams } } = this.props;
    setParams({
      i18n,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { user: prevUser } = this.props;
    const { user } = nextProps;
    if ((!user && prevUser) || (user && !prevUser)) {
      const { routes, index } = this.state;
      if (!user) {
        if (index === 3) {
          this.setState({
            ...this.state,
            routes: routes.filter(route => route.key !== 4),
            index: 0,
          });
        } else {
          this.setState({
            ...this.state,
            routes: routes.filter(route => route.key !== 4),
          });
        }
      } else if (!routes.some(route => route.key === 4)) {
        this.setState({
          ...this.state,
          routes: [...routes, { key: '4', title: 'My Pixiv' }],
        });
      }
    }
  }

  handleChangeTab = index => {
    this.setState({ index });
  };

  renderScene = ({ route }) => {
    switch (route.key) {
      case '1':
        return <FollowingUserIllusts />;
      case '2':
        return <NewIllusts />;
      case '3':
        return <NewMangas />;
      case '4':
        return <MyPixiv />;
      default:
        return null;
    }
  };

  render() {
    return (
      <PXTabView
        navigationState={this.state}
        renderScene={this.renderScene}
        onRequestChangeTab={this.handleChangeTab}
        includeStatusBarPadding
        tabBarProps={{ scrollEnabled: true }}
      />
    );
  }
}

export default connectLocalization(
  connect(state => ({
    user: state.auth.user,
  }))(NewWorks),
);
