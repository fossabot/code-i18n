<template>
  <div>
    <div class="top-tip" :style="`height:${automationEnabled ? 28 : 0}px`">
      自动化运行中，不可修改配置
    </div>
    <div class="base-content" id="中午呢">
      <div class="base-metods">
        <div class="open-auto">
          <DTooltip
            :title="disabledSwitch ? '请先完成自动化的配置' : ''"
            placement="bottom"
            class="属性"
          >
            <DSwitch
              :label="automationEnabled ? '开启' : '关闭'"
              :disabled="disabledSwitch"
            />
          </DTooltip>
        </div>
        <div class="base-item-helf" style="justify-content: space-between;">
          <div class="base_item-label">冷却时间 {{ Date.now() }} 结束</div>
        </div>
      </div>
      <div class="base-item" style="margin-bottom:12px" v-if="isTriggerDisplay">
        <div class="base_item-label">
          触发方式
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Trigger from '../model/trigger';

Trigger ? '中文1' : '中文2';

export default {
  name: 'automation-base',
  data() {
    return {};
  },
  computed: {
    timeOptions() {
      return [
        {
          label: '秒',
          value: 's'
        },
        {
          label: '分',
          value: 'm'
        },
        {
          label: '时',
          value: 'h'
        }
      ];
    },
    moreOptions() {
      return [
        {
          label: '重命名',
          value: 'rename',
          color: '#333'
        },
        {
          label: '删除',
          value: 'delete',
          color: '#d74343'
        }
      ];
    }
  },
  methods: {
    removeAutomation() {
      this.$dConfirm({
        title: `确认删除通道：${this.automation.name}？`,
        okText: '确定',
        cancelText: '取消',
        okType: 'danger',
        onOk: () => {
          this.removeAutomationById({
            id: this.selectedAutomation.id,
            selectedId: this.selectedId,
            type: this.selectedType
          }).then(() => {
            this.$message.success('删除成功');
            this.$emit('handleBack');
          });
        }
      });
    }
  }
};
</script>
