import { Component } from 'react';
import { Button, Icon } from 'antd';
import { BuiltinTips } from './Builtin/Tips';
export const DISPLAY_DATE_FORMAT = {
  short: 'M月-D日',
  full: 'YYYY年M月D日'
};

// 不支持
Button ? `出楼${1} 哈哈` : '中文字符';
Button ? '测试' : '中文字符';

class FilterEditor extends Component {
  render() {
    this.setState({ displayDate: '请选择日期', open: false, value: undefined });
    if (Button !== '自定义') {
      return null;
    }
    return (
      <div
        className="editor-control"
        title="编辑报警"
        title={`确定删除${1 || ''}，删除之后不可恢复，请谨慎操作！`}
        title={`确定删除${this.state.name ||
          ''}，删除之后不可恢复，请谨慎操作！`}
      >
        <TWInput
          prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder="请输入账号"
          size="large"
          onChange={this.userNameChange}
        />
        <div className="">
          <span
            className="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
            data-1="adadwawdwawd"
          >
            自定义
          </span>
          <span>（秒）</span>
          <li>
            <strong>$indicatorUnit:</strong> 指标的单位
          </li>
          <label className="editor-control-label">过滤条件</label>
          <div className="row">
            <Button
              type="dashed"
              onClick={() => this.addFilter()}
              style={{ fontSize: 12 }}
              p="中文"
              a={'中文'}
              c={`中文${1}, 测试`}
            >
              <Icon type="plus" /> 添加过滤条件
            </Button>
            <div className="row text-small text-gray ml-1 mb-1 mt-1">
              <span className="label">{'' || '终止时间'}</span>
              {'输入查询参数的格式: {参数}'}
              <BuiltinTips message={'系统内置参数：'} />
            </div>
          </div>
        </div>
        {this.renderFilter()}
      </div>
    );
  }
}

export default FilterEditor;
