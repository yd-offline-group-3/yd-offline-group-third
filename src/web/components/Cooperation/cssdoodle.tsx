import React from 'react';
import Doodle from './doodle';

const MyDoole = () => {
    return (
        <>

        <Doodle rule={`
        @grid: 1x10 / 85%;

        @place-cell: center;
        @size: calc(@i * 10%);
        
        border-radius: 50%;
        border-style: dashed;
        border-width: calc(@i * 4px);
        border-color: hsla(
          calc(20 * @i), 70%, 68%,
          calc(3 / @i * .8)
        );
        
        transform: rotate(@r(360deg));
        
        `}></Doodle>
        
        <Doodle rule={`
          :doodle {
            @grid: 7 / 100vmax;
            background: #0a0c27;
          }
          @shape: clover 5;
          background: hsla(
            calc(360 - @i * 4), 70%, 68%, @r.8
          );
          transform:
            scale(@r(.2, 1.5))
            translate(@m2.@r(±50%));
        `}></Doodle>
      </>
    )
}

export default MyDoole;