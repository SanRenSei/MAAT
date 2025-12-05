
export default class RandomUtil {
  sampleSet: any[];
  thresholdToReDeal: number;
  deck: any[];

  constructor(sampleSet, thresholdToReDeal) {
    this.sampleSet = [...sampleSet];
    this.thresholdToReDeal = thresholdToReDeal;
    this.deck = [];
    this.checkRedeal();
  }

  checkRedeal() {
    if (this.deck.length <= this.thresholdToReDeal) {
      this.redeal();
    }
  }

  redeal() {
    this.sampleSet.forEach(i => this.deck.push(i));
    this.checkRedeal();
  }

  deal() {
    let toReturn = this.deck.splice(Math.floor(Math.random()*this.deck.length), 1)[0];
    this.checkRedeal();
    return toReturn;
  }
  
}