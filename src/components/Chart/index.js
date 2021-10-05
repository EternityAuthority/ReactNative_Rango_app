import React from 'react';
import {Grid, LineChart, XAxis, YAxis} from 'react-native-svg-charts';
import {View} from 'react-native';
import * as shape from 'd3-shape';
import s from '../../assets/styles';

class Chart extends React.PureComponent {
  render() {
    const {data} = this.props;
    const axesSvg = {fontSize: 10, fill: 'grey'};
    const verticalContentInset = {top: 10, bottom: 10};
    const horizontalContentInset = {left: 10, right: 10};
    const xAxisHeight = 30;

    // Layout of an x-axis together with a y-axis is a problem that stems from flexbox.
    // All react-native-svg-charts components support full flexbox and therefore all
    // layout problems should be approached with the mindset "how would I layout regular Views with flex in this way".
    // In order for us to align the axes correctly we must know the height of the x-axis or the width of the x-axis
    // and then displace the other axis with just as many pixels. Simple but manual.

    return (
      <View style={[{height: s.img200.height}, s.ps20, s.pe20, s.flexRow]}>
        <YAxis
          data={data}
          yAccessor={({item}) => item.trophy}
          style={{marginBottom: xAxisHeight}}
          contentInset={verticalContentInset}
          numberOfTicks={7}
          svg={axesSvg}
        />
        <View style={[s.flex1, s.ms10]}>
          <LineChart
            style={s.flex1}
            data={data}
            yAccessor={({item}) => item.trophy}
            //curve={shape.curveNatural}
            contentInset={verticalContentInset}
            svg={{
              strokeWidth: 2,
              strokeLinecap: 'round',
              stroke: s.textPrimary.color,
            }}>
            <Grid />
          </LineChart>
          <XAxis
            style={{marginHorizontal: -10, height: xAxisHeight}}
            data={data}
            //xAccessor={({item, index}) => item.day}
            formatLabel={(value, index) => data[index].day}
            contentInset={horizontalContentInset}
            svg={axesSvg}
          />
        </View>
      </View>
    );
  }
}

export default Chart;
