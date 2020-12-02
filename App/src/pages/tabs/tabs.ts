import { Component } from '@angular/core';

import { FridgePage } from '../fridge/fridge';
import { StatisticsPage } from '../statistics/statistics';
import { AdvicePage } from '../advice/advice';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = FridgePage;
  tab2Root = StatisticsPage;
  tab4Root=AdvicePage;
  tab5Root=ProfilePage;

  constructor() {

  }
}
