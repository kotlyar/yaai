export default class Campaign {
  constructor(item) {
    const campaign = structuredClone(item);

    Object.assign(this, campaign);
    this.createdAtDate = campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : '';
    this.startDateFormatted = campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : '';
    this.endDateFormatted = campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : '';
    
    // Calculated metrics
    this.ctr = this.calculateCTR();
    this.cpc = this.calculateCPC();
    this.roi = this.calculateROI();
  }

  calculateCTR() {
    if (!this.totalImpressions || this.totalImpressions === 0) return 0;
    return (this.totalClicks / this.totalImpressions) * 100;
  }

  calculateCPC() {
    if (!this.totalClicks || this.totalClicks === 0) return 0;
    return this.totalCost / this.totalClicks;
  }

  calculateROI() {
    if (!this.totalCost || this.totalCost === 0) return 0;
    const revenue = this.totalConversions * 1000; // Примерная конверсия в рубли
    return ((revenue - this.totalCost) / this.totalCost) * 100;
  }

  getStatusColor() {
    switch (this.status) {
      case 'ACTIVE': return 'green';
      case 'PAUSED': return 'orange';
      case 'ARCHIVED': return 'red';
      default: return 'gray';
    }
  }
}