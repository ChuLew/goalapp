import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState ,EditingState, IntegratedEditing} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
  Toolbar,
  ViewSwitcher,
  MonthView,
  DayView,
  DateNavigator,
  TodayButton,
  AppointmentTooltip,
  ConfirmationDialog,
  DragDropProvider,
  EditRecurrenceMenu,
  AllDayPanel,
  AppointmentForm
} from '@devexpress/dx-react-scheduler-material-ui';
import AppNav from './AppNav';
 const appointments = [
    {
      title: 'Website Re-Design Plan',
      startDate: new Date(2020, 6, 23, 9, 30),
      endDate: new Date(2020, 6, 23, 11, 30),
    }
  ];

const dragDisableIds = new Set([3, 8, 10, 12]);
const allowDrag = ({ id }) => !dragDisableIds.has(id);
const appointmentComponent = (props) => {
  if (allowDrag(props.data)) {
    return <Appointments.Appointment {...props} />;
  } return <Appointments.Appointment {...props} style={{ ...props.style, cursor: 'not-allowed' }} />;
};
const SHIFT_KEY = 16;
const messages = {
    moreInformationLabel: '',
  };
  
  const TextEditor = (props) => {
    // eslint-disable-next-line react/destructuring-assignment
    if (props.type === 'multilineTextEditor') {
      return null;
    } return <AppointmentForm.TextEditor {...props} />;
  };
  
  const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
    const onCustomFieldChange = (nextValue) => {
      onFieldChange({ customField: nextValue });
    };
    const onKeyEventChange = (nextValue) => {
        onFieldChange({ keyField: nextValue });
      };
  
    return (
      <AppointmentForm.BasicLayout
        appointmentData={appointmentData}
        onFieldChange={onFieldChange}
        {...restProps}
      >
        <AppointmentForm.Label
          text="Custom Field"
          type="title"
        />
        <AppointmentForm.TextEditor
          value={appointmentData.customField}
          onValueChange={onCustomFieldChange}
          placeholder="Custom field"
        />
        <AppointmentForm.Label
          text="Key event indicator"
          type="title"
        />
        <AppointmentForm.TextEditor
          value={appointmentData.keyField}
          onValueChange={onKeyEventChange}
          placeholder="Key Event"
        />
      </AppointmentForm.BasicLayout>
    );
  };
  
export default class Goal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: appointments,
      isShiftPressed: false,
    };
    this.commitChanges = this.commitChanges.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.commitChanges = this.commitChanges.bind(this);
    this.currentViewNameChange = (currentViewName) => {
      this.setState({ currentViewName });
    };
  }
  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown');
    window.removeEventListener('keyup');
  }

  onKeyDown(event) {
    if (event.keyCode === SHIFT_KEY) {
      this.setState({ isShiftPressed: true });
    }
  }

  onKeyUp(event) {
    if (event.keyCode === SHIFT_KEY) {
      this.setState({ isShiftPressed: false });
    }
  }
  commitChanges({ added, changed, deleted }) {
    this.setState((state) => {
      let { data } = state;
      if (added) {
        const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, { id: startingAddedId, ...added }];
      }
      if (changed) {
        data = data.map(appointment => (
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
      }
      if (deleted !== undefined) {
        data = data.filter(appointment => appointment.id !== deleted);
      }
      return { data };
    });
  }


  render() {
    const { data} = this.state;

    return (
        <div>
            <AppNav/>
        <Paper>
          <Scheduler
            data={data}
          >
            <ViewState
              defaultCurrentDate="2020-06-22"
              defaultCurrentViewName="Week"
            />   
            <EditingState
            onCommitChanges={this.commitChanges}
          />
          <EditRecurrenceMenu />
          <IntegratedEditing />
            <DayView
            startDayHour={9}
            endDayHour={18}
          />
          <WeekView
            startDayHour={10}
            endDayHour={19}
          />
            <MonthView />
            <ConfirmationDialog />
            <Toolbar />
            <DateNavigator />
            <ViewSwitcher />
            <TodayButton />
            <Appointments
            appointmentComponent={appointmentComponent}
          />
            <AllDayPanel />
            <DragDropProvider
            allowDrag={allowDrag}
          />
            <AppointmentTooltip
            showCloseButton
            showOpenButton
          /><AppointmentForm
          basicLayoutComponent={BasicLayout}
          textEditorComponent={TextEditor}
          messages={messages}/>
          </Scheduler>
        </Paper>

        </div>
      );
  }
}
