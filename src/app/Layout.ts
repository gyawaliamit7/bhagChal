import { Path } from './Path';

// creating the layout
export const setLayout = (path: Path[]) => {
    for (let i = 0 ; i < 5; ++i) {
        for (let j = 0; j < 5; ++j) {
           const temp = new Path();
           temp.set_x(i);
           temp.set_y(j);
           path.push(temp);
        }
      }
    return path;
};

// making the lines
export const makeLines  = (path: Path[]) => {
    path.forEach(e => {
        if ( (e.get_x() + e.get_y()) % 2 === 0) {
          path.forEach( x => {
            if ((Math.abs(e.get_x() - x.get_x()) === 1)  && (e.get_y() === x.get_y()) ) {
              const temp  = new Path();
              temp.set_x(x.get_x());
              temp.set_y(x.get_y());
              e.set_connector(temp);
            }
            if ((Math.abs(e.get_y() - x.get_y()) === 1) && (x.get_x() === e.get_x())) {
              const temp  = new Path();
              temp.set_x(x.get_x());
              temp.set_y(x.get_y());
              e.set_connector(temp);
            }
            if ((Math.abs(e.get_x() - x.get_x()) === 1) &&  (Math.abs(e.get_y() - x.get_y()) === 1)) {
              const temp  = new Path();
              temp.set_x(x.get_x());
              temp.set_y(x.get_y());
              e.set_connector(temp);
            }
          });
        }
      });
    return path;
};

// making border
export const createBorder = (ctx: any, path: Path[]) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 900, 500);
    path.forEach(e => {
      const connector = e.get_connector();
      connector.forEach(connection => {
        ctx.beginPath();
        ctx.moveTo((e.get_x() + 1) * 100, (e.get_y() + 1) * 100);
        ctx.lineTo((connection.get_x() + 1) * 100 , (connection.get_y() + 1) * 100  );
        ctx.stroke();
      });
    });

};

// back Button
export const backButton = (ctx: any) => {
    ctx.fillStyle = '#000000';
    ctx.fillRect(100, 20, 80, 50);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Back', 100 , 50);
};


export const displayInfo = (x: any, ctx: any) => {
    ctx.fillStyle = '#000000';
    ctx.fillRect(50, 550, 300, 50);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(x, 50 , 580);
};

export const fillAnimals = (ctx: any, path: Path[]) => {
    path.forEach(e => {
        if (e.isTiger) {
          ctx.font = '30px Arial';
          ctx.fillStyle = '#ff0000';
          ctx.fillText('X', (e.get_x() + 1) * 100 , (e.get_y() + 1 ) * 100);
        } else if (e.isDeer) {
          ctx.font = '30px Arial';
          ctx.fillStyle = '#0000ff';
          ctx.fillText('O', (e.get_x() + 1) * 100 , (e.get_y() + 1 ) * 100);
        }
      });
};






