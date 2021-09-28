import { runInAction, decorate, observable, action } from "mobx";
import { getStepData } from "../services/StepService";

class ObservableStepStore {
  
  stepData = null;

  fetchStepData = async (params) => {
    try {
      const stepResData = await getStepData(params);
      runInAction(() => {
        const {workData, stepData} = stepResData;
        //console.log(workData, stepData);
        if(workData.jotFormConfig  && workData.jotFormConfig.Workflow){
          //console.log('here')
          //console.log('here0', stepRep.data, workRep.data.jotFormConfig.rootElement);
          let currStepData = workData.jotFormConfig.Workflow.find((o)=>{
            return (o.stepId === stepData.stepId)
          })
          //console.log('here',{currStep:currStepData, workflow: workData.jotFormConfig.Workflow, stepData: stepData})
          this.stepData = {currStep:currStepData, workflow: workData.jotFormConfig.Workflow, stepsData: stepData};
        }
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
      });
    }
    return this.stepData;
  };
}

decorate(ObservableStepStore, {
  stepData: observable,
  fetchStepData: action
});
export default new ObservableStepStore();
