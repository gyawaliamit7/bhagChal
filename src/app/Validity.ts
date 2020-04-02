import { Path } from './Path';


export const moveCheck = (temp: Path, prev: Path, isDeer: boolean) => {
    // if the current point is empty
    if (!temp.isTiger && !temp.isDeer) {
        // if current point is horizontal
        if (temp.get_y() === prev.get_y()) {
          // if the prev and current point difference is 1
          if (Math.abs(temp.get_x() - prev.get_x()) === 1) {
            if (!isDeer) {
                temp.set_tiger(true);
                prev.set_tiger(false);
            } else {
                temp.set_deer(true);
                prev.set_deer(false);
            }
            return true;
          }
        }
        // if current point is vertical
        if (temp.get_x() === prev.get_x()) {
          // if the prev and  current point difference is 1
          if (Math.abs(temp.get_y() - prev.get_y()) === 1) {
            if (!isDeer) {
                temp.set_tiger(true);
                prev.set_tiger(false);
            } else {
                temp.set_deer(true);
                prev.set_deer(false);
            }
            return true;
          }
        }
        // if current point is accross
        const commonConnector = temp.get_connector().some(e => e.get_x() === prev.get_x() && e.get_y() === prev.get_y());
        const secondConnector = prev.get_connector().some(e => e.get_x() === temp.get_x() && e.get_y() === temp.get_y());
        if (commonConnector || secondConnector) {
            console.log('Common connector is');
            console.log(commonConnector);
            console.log('second connector is');
            console.log(secondConnector);
            if (!isDeer) {
                temp.set_tiger(true);
                prev.set_tiger(false);
            } else {
                temp.set_deer(true);
                prev.set_deer(false);
            }
            return true;
        }
    }
    return false;
};

export const deerCheck = (temp: Path, prev: Path, path: Path[]) => {
    // verifying that the point is empty
    if (!temp.isDeer && !temp.isTiger) {
        //  if horizontal
        if (temp.get_y() === prev.get_y()) {
          // if the prev and current point difference is 2
          if (Math.abs(temp.get_x() - prev.get_x()) === 2) {
            // checking what is in the middle
            if (temp.get_x() > prev.get_x()) {
              const middle = path.find(e =>  e.get_x() === prev.get_x() + 1 && e.get_y() === prev.get_y());
              if (middle.isDeer) {
                middle.set_deer(false);
                return true;
              }
            } else {
              const middle = path.find(e =>  e.get_x() === temp.get_x() + 1 && e.get_y() === temp.get_y());
              if (middle.isDeer) {
                middle.set_deer(false);
                return true;
              }
            }
          }
        }
        // if vertical
        if (temp.get_x() === prev.get_x()) {
          // if the prev and current point difference is 2
          if (Math.abs(temp.get_y() - prev.get_y()) === 2) {
            // checking what is in the middle
            if (temp.get_y() > prev.get_y()) {
              const middle = path.find(e =>  e.get_y() === prev.get_y() + 1 && e.get_x() === prev.get_x());
              if (middle.isDeer) {
                middle.set_deer(false);
                return true;
              }
            } else {
              const middle = path.find(e =>  e.get_y() === temp.get_y() + 1 && e.get_x() === temp.get_x());
              if (middle.isDeer) {
                middle.set_deer(false);
                return true;
              }
            }
          }
        }
        const mutualConnector = temp.get_connector().find( e => {
          return prev.get_connector().find(f => f.get_x() === e.get_x() && f.get_y() === e.get_y());
        });
        const findPath = path.find(e => e.get_x() === mutualConnector.get_x() && e.get_y() === mutualConnector.get_y());
        console.log('Mutual connector is');
        console.log(mutualConnector);
        if (findPath.isDeer) {
          findPath.set_deer(false);
          return true;
        }
      }
    return false;
};



