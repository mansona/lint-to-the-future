import Component from '@glimmer/component';

export default class Stats extends Component {
  get improvedToday() {
    let biggest;

    for (let [rule, value] of Object.entries(
      this.args.data?.today?.changed ?? {},
    )) {
      if (value > 0) {
        continue;
      }
      // removing trumps improvement
      if (this.removedToday.has(rule)) {
        continue;
      }
      // remember smaller numbers are bigger "improvmeents";
      if (!biggest || value < biggest.value) {
        biggest = { rule, value };
      }
    }
    return biggest;
  }

  get improvedThisWeek() {
    let biggest;

    for (let [rule, value] of Object.entries(
      this.args.data?.thisWeek?.changed ?? {},
    )) {
      if (
        value > 0 ||
        rule === this.improvedToday?.rule ||
        value >= this.improvedToday?.value
      ) {
        continue;
      }

      // removing trumps improvement
      if (this.removedThisWeek.has(rule)) {
        continue;
      }

      // remember smaller numbers are bigger "improvmeents";
      if (!biggest || value < biggest.value) {
        biggest = { rule, value };
      }
    }

    return biggest;
  }

  get mostAddedToday() {
    let biggest;

    for (let [rule, value] of Object.entries(
      this.args.data?.today?.changed ?? {},
    )) {
      if (value < 0) {
        continue;
      }
      // new trumps added
      if (this.newToday.has(rule)) {
        continue;
      }

      if (!biggest || value > biggest.value) {
        biggest = { rule, value };
      }
    }
    return biggest;
  }

  get mostAddedThisWeek() {
    let biggest;

    for (let [rule, value] of Object.entries(
      this.args.data?.thisWeek?.changed ?? {},
    )) {
      if (
        value < 0 ||
        rule === this.mostAddedToday?.rule ||
        value <= this.mostAddedToday?.value
      ) {
        continue;
      }

      // new trumps added
      if (this.newToday.has(rule) || this.newThisWeek.has(rule)) {
        continue;
      }

      if (!biggest || value > biggest.value) {
        biggest = { rule, value };
      }
    }

    return biggest;
  }

  get newToday() {
    return new Set(this.args.data?.today?.added);
  }

  get newThisWeek() {
    return new Set(this.args.data?.thisWeek?.added).difference(this.newToday);
  }

  get removedToday() {
    return new Set(this.args.data?.today?.removed);
  }

  get removedThisWeek() {
    return new Set(this.args.data?.thisWeek?.removed).difference(
      this.removedToday,
    );
  }
}
