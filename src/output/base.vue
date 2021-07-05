<template>
  <div>
    <div class="top-tip" :style="`height:${automationEnabled ? 28 : 0}px`">
      {{ j18n.expand(j18n.load('script__input__base___3')) }}
    </div>
    <div
      class="base-content"
      :id="j18n.expand(j18n.load('script__input__base___5'))"
    >
      <div class="base-metods">
        <div class="open-auto">
          <DTooltip
            :title="
              disabledSwitch
                ? j18n.expand(j18n.load('script__input__base___9'))
                : ''
            "
            placement="bottom"
            :class="j18n.expand(j18n.load('script__input__base___11'))"
          >
            <DSwitch
              :label="
                automationEnabled
                  ? j18n.expand(j18n.load('script__input__base___14____4'))
                  : j18n.expand(j18n.load('script__input__base___14'))
              "
              :disabled="disabledSwitch"
            />
          </DTooltip>
        </div>
        <div class="base-item-helf" style="justify-content: space-between;">
          <div class="base_item-label">
            {{ j18n.expand(j18n.load('script__input__base___20', Date.now())) }}
          </div>
        </div>
      </div>
      <div class="base-item" style="margin-bottom:12px" v-if="isTriggerDisplay">
        <div class="base_item-label">
          {{ j18n.expand(j18n.load('script__input__base___25')) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Trigger from '../model/trigger';

Trigger
  ? j18n.expand(j18n.load('script__input__base___35____8'))
  : j18n.expand(j18n.load('script__input__base___35'));

export default {
  name: 'automation-base',
  data() {
    return {};
  },
  computed: {
    timeOptions() {
      return [
        {
          label: j18n.expand(j18n.load('script__input__base___46')),
          value: 's'
        },
        {
          label: j18n.expand(j18n.load('script__input__base___50')),
          value: 'm'
        },
        {
          label: j18n.expand(j18n.load('script__input__base___54')),
          value: 'h'
        }
      ];
    },
    moreOptions() {
      return [
        {
          label: j18n.expand(j18n.load('script__input__base___62')),
          value: 'rename',
          color: '#333'
        },
        {
          label: j18n.expand(j18n.load('script__input__base___67')),
          value: 'delete',
          color: '#d74343'
        }
      ];
    }
  },
  methods: {
    removeAutomation() {
      this.$dConfirm({
        title: j18n.expand(
          j18n.load('script__input__base___77', this.automation.name)
        ),
        okText: j18n.expand(j18n.load('script__input__base___78')),
        cancelText: j18n.expand(j18n.load('script__input__base___79')),
        okType: 'danger',
        onOk: () => {
          this.removeAutomationById({
            id: this.selectedAutomation.id,
            selectedId: this.selectedId,
            type: this.selectedType
          }).then(() => {
            this.$message.success(
              j18n.expand(j18n.load('script__input__base___87'))
            );
            this.$emit('handleBack');
          });
        }
      });
    }
  }
};
</script>
