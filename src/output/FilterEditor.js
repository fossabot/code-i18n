import { Component } from 'react';
import { Button, Icon } from 'antd';
import { BuiltinTips } from './Builtin/Tips';
export const DISPLAY_DATE_FORMAT = {
  short: j18n.expand(j18n.load('script__input__FilterEditor___4')),
  full: j18n.expand(j18n.load('script__input__FilterEditor___5'))
};

// 不支持
Button
  ? j18n.expand(j18n.load('script__input__FilterEditor___9', 1))
  : '中文字符';
Button
  ? j18n.expand(j18n.load('script__input__FilterEditor___10____3'))
  : j18n.expand(j18n.load('script__input__FilterEditor___10'));

class FilterEditor extends Component {
  render() {
    this.setState({
      displayDate: j18n.expand(j18n.load('script__input__FilterEditor___14')),
      open: false,
      value: undefined
    });
    if (Button !== j18n.expand(j18n.load('script__input__FilterEditor___15'))) {
      return null;
    }
    return (
      <div
        className="editor-control"
        title={j18n.expand(j18n.load('script__input__FilterEditor___21'))}
        title={j18n.expand(
          j18n.load('script__input__FilterEditor___22', 1 || '')
        )}
        title={`{ j18n.expand(j18n.load('script__input__FilterEditor___23')) }${this
          .state.name ||
          ''}，{ j18n.expand(j18n.load('script__input__FilterEditor___24')) }！`}
      >
        <TWInput
          prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder={j18n.expand(
            j18n.load('script__input__FilterEditor___28')
          )}
          size="large"
          onChange={this.userNameChange}
        />
        <div className="">
          <span
            className="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
            data-1="adadwawdwawd"
          >
            {j18n.expand(j18n.load('script__input__FilterEditor___37'))}
          </span>
          <span>
            {j18n.expand(j18n.load('script__input__FilterEditor___39'))}
          </span>
          <li>
            <strong>$indicatorUnit:</strong>{' '}
            {j18n.expand(j18n.load('script__input__FilterEditor___41'))}
          </li>
          <label className="editor-control-label">
            {j18n.expand(j18n.load('script__input__FilterEditor___43'))}
          </label>
          <div className="row">
            <Button
              type="dashed"
              onClick={() => this.addFilter()}
              style={{ fontSize: 12 }}
              p={j18n.expand(j18n.load('script__input__FilterEditor___49'))}
              a={j18n.expand(j18n.load('script__input__FilterEditor___50'))}
              c={j18n.expand(j18n.load('script__input__FilterEditor___51', 1))}
            >
              <Icon type="plus" />{' '}
              {j18n.expand(j18n.load('script__input__FilterEditor___53'))}
            </Button>
            <div className="row text-small text-gray ml-1 mb-1 mt-1">
              <span className="label">
                {j18n.expand(j18n.load('script__input__FilterEditor___56'))}
              </span>
              {j18n.expand(j18n.load('script__input__FilterEditor___57'))}
              <BuiltinTips
                message={j18n.expand(
                  j18n.load('script__input__FilterEditor___58')
                )}
              />
            </div>
          </div>
        </div>
        {this.renderFilter()}
      </div>
    );
  }
}

export default FilterEditor;
